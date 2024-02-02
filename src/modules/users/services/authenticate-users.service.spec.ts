import { TestAppDataSource } from '@shared/infra/http/data-source';

import UserRepository from '../infra/typeorm/repositories/user.repository';
import FeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import AppErrorTypes from '@shared/errors/app-error-types';

import AuthenticateUsersService from './authenticate-users.service';

import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

import { container } from 'tsyringe';

let userRepository: UserRepository;
let featureRepository: FeatureRepository;
let featureGroupRepository: FeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let authenticateUsersService: AuthenticateUsersService;

describe('AuthenticateUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    userRepository = new UserRepository();
    featureRepository = new FeatureRepository();
    featureGroupRepository = new FeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    authenticateUsersService = new AuthenticateUsersService(
      userRepository,
      hashProvider,
    );

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await userRepository.create({
      id: '1',
      name: 'John Doe Invalid',
      email: 'johndoe@example.com',
      password: '123456789',
      featureGroupId: '1',
    });

    const feature = await featureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'Feature Name',
    });

    await featureGroupRepository.create({
      id: '2',
      key: 'feature-group-key-2',
      name: 'Feature Group Name 2',
      features: [feature],
    });

    const encryptedPassword = await hashProvider.generateHash('123456789');

    await userRepository.create({
      id: '2',
      name: 'John Doe Valid',
      email: 'johndoe_valid@example.com',
      password: encryptedPassword,
      featureGroupId: '2',
    });

    container.reset();

    container.register('FeatureRepository', {
      useValue: featureRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(UserRepository).toBeDefined();
    expect(FeatureRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(authenticateUsersService).toBeDefined();
  });

  test('should throw an error if no user is found by email', async () => {
    const userPayload = {
      email: 'no_existing_email@example.com',
      password: '123456',
    };

    jest.spyOn(userRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.invalidCredentials,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if user not have feature group and standalone features', async () => {
    const userPayload = {
      email: 'johndoe@example.com',
      password: '123456789',
    };

    jest.spyOn(userRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.missingUserFeatureGroup,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if password is incorrect', async () => {
    const userPayload = {
      email: 'johndoe_valid@example.com',
      password: 'invalid_password',
    };

    jest.spyOn(hashProvider, 'compareHash');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.invalidCredentials,
    );

    expect(hashProvider.compareHash).toHaveBeenCalledWith(
      userPayload.password,
      expect.anything(),
    );

    expect(hashProvider.compareHash).toHaveBeenCalledTimes(1);
  });

  test('should be generate a token for the user', async () => {
    const userPayload = {
      email: 'johndoe_valid@example.com',
      password: '123456789',
    };

    const result = await authenticateUsersService.execute(userPayload);
    const token = result.token;

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    const decoded = verify(token, authConfig.jwt.secret);
    expect(decoded).toBeDefined();
    expect(decoded).toHaveProperty('sub');
    expect(decoded).toHaveProperty('featureGroup');
    expect(decoded).toHaveProperty('standaloneFeatures');
  });
});