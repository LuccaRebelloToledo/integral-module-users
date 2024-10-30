import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import { container } from 'tsyringe';

import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth.config';

import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';
import UserTokensRepository from '../infra/typeorm/repositories/user-tokens.repository';
import UsersRepository from '../infra/typeorm/repositories/users.repository';
import HashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import AuthenticateUsersService from './authenticate-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('AuthenticateUsersService', () => {
  let usersRepository: UsersRepository;
  let featuresRepository: FeaturesRepository;
  let featureGroupsRepository: FeatureGroupsRepository;
  let hashProvider: HashProvider;
  let userTokensRepository: UserTokensRepository;
  let authenticateUsersService: AuthenticateUsersService;
  let encryptedPassword: string;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    hashProvider = new HashProvider();
    userTokensRepository = new UserTokensRepository();
    authenticateUsersService = new AuthenticateUsersService(
      usersRepository,
      hashProvider,
      userTokensRepository,
    );

    const featureGroupOne = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    encryptedPassword = await hashProvider.generateHash('123456789');

    await usersRepository.create({
      name: 'John Doe Invalid',
      email: 'johndoe@example.com',
      password: encryptedPassword,
      featureGroupId: featureGroupOne.id,
    });

    const feature = await featuresRepository.create({
      key: 'feature-key',
      name: 'Feature Name',
    });

    const featureGroupTwo = await featureGroupsRepository.create({
      key: 'feature-group-key-2',
      name: 'Feature Group Name 2',
      features: [feature],
    });

    await usersRepository.create({
      name: 'John Doe Valid',
      email: 'johndoe_valid@example.com',
      password: encryptedPassword,
      featureGroupId: featureGroupTwo.id,
    });

    container.reset();

    container.register('FeaturesRepository', {
      useValue: featuresRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(authenticateUsersService).toBeDefined();
  });

  test('should throw an error if no user is found by email', async () => {
    const userPayload = {
      email: 'no_existing_email@example.com',
      password: '123456',
    };

    jest.spyOn(usersRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.invalidCredentials,
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
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

  test('should throw an error if user not have feature group and standalone features', async () => {
    const userPayload = {
      email: 'johndoe@example.com',
      password: '123456789',
    };

    jest.spyOn(usersRepository, 'findByEmail');

    await expect(authenticateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.sessions.missingUserFeatureGroup,
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should be generate a token for the user', async () => {
    const userPayload = {
      email: 'johndoe_valid@example.com',
      password: '123456789',
    };

    const { accessToken, refreshToken } =
      await authenticateUsersService.execute(userPayload);

    expect(accessToken).toBeDefined();
    expect(accessToken.length).toBeGreaterThan(0);
    expect(refreshToken).toBeDefined();
    expect(refreshToken.length).toBeGreaterThan(0);

    const decoded = verify(accessToken, authConfig.jwt.secret);
    expect(decoded).toBeDefined();
    expect(decoded).toHaveProperty('sub');
  });
});
