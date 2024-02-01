import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import FakeFeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository.fake';
import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import AppErrorTypes from '@shared/errors/app-error-types';

import AuthenticateUsersService from './authenticate-users.service';

import { container } from 'tsyringe';

import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureRepository: FakeFeatureRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let authenticateUsersService: AuthenticateUsersService;

describe('AuthenticateUsersService', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureRepository = new FakeFeatureRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    authenticateUsersService = new AuthenticateUsersService(
      fakeUserRepository,
      hashProvider,
    );

    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await fakeUserRepository.create({
      id: '1',
      name: 'John Doe Invalid',
      email: 'johndoe@example.com',
      password: '123456789',
      featureGroupId: '1',
    });

    const feature = await fakeFeatureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'Feature Name',
    });

    await fakeFeatureGroupRepository.create({
      id: '2',
      key: 'feature-group-key-2',
      name: 'Feature Group Name 2',
      features: [feature],
    });

    const encryptedPassword = await hashProvider.generateHash('123456789');

    await fakeUserRepository.create({
      id: '2',
      name: 'John Doe Valid',
      email: 'johndoe_valid@example.com',
      password: encryptedPassword,
      featureGroupId: '2',
    });

    container.reset();

    container.register('FeatureRepository', {
      useValue: fakeFeatureRepository,
    });
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  test('should be defined', () => {
    expect(fakeUserRepository).toBeDefined();
    expect(fakeFeatureRepository).toBeDefined();
    expect(fakeFeatureGroupRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(authenticateUsersService).toBeDefined();
  });

  test('should throw an error if no user is found by email', async () => {
    const userPayload = {
      email: 'no_existing_email@example.com',
      password: '123456',
    };

    jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.invalidCredentials,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledWith(
      userPayload.email,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if user not have feature group and standalone features', async () => {
    const userPayload = {
      email: 'johndoe@example.com',
      password: '123456789',
    };

    jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.missingUserFeatureGroup,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledWith(
      userPayload.email,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledTimes(1);
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
