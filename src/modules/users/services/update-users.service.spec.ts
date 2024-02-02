import { TestAppDataSource } from '@shared/infra/http/data-source';

import UserRepository from '../infra/typeorm/repositories/user.repository';
import FeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import User from '../infra/typeorm/entities/user.entity';

import UpdateUsersService from './update-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';
import UserRepositoryInterface from '../repositories/user.repository.interface';
import FeatureGroupRepositoryInterface from '@modules/features/repositories/feature-group.repository.interface';
import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';

let userRepository: UserRepository;
let featureRepository: FeatureRepository;
let featureGroupRepository: FeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let updateUsersService: UpdateUsersService;
let user: User;

describe('UpdateUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    userRepository = new UserRepository();
    featureRepository = new FeatureRepository();
    featureGroupRepository = new FeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    updateUsersService = new UpdateUsersService(userRepository, hashProvider);

    container.reset();

    container.registerSingleton<UserRepositoryInterface>(
      'UserRepository',
      UserRepository,
    );

    container.registerSingleton<FeatureGroupRepositoryInterface>(
      'FeatureGroupRepository',
      FeatureGroupRepository,
    );

    container.registerSingleton<FeatureRepositoryInterface>(
      'FeatureRepository',
      FeatureRepository,
    );

    const feature = await featureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'Feature Name',
    });

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [feature],
    });

    user = await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(UserRepository).toBeDefined();
    expect(FeatureRepository).toBeDefined();
    expect(FeatureGroupRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(updateUsersService).toBeDefined();
    expect(user).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userPayload = {
      id: 'non-existing-user-id',
    };

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );
  });

  test('should throw an error if user is found by email', async () => {
    await userRepository.create({
      id: '2',
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    const userPayload = {
      id: '1',
      email: 'johndoe2@example.com',
    };

    jest.spyOn(userRepository, 'findByEmail');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    const userPayload = {
      id: '1',
      featureGroupId: '2',
    };

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );
  });

  test('should throw an error if no feature is found by id', async () => {
    const userPayload = {
      id: '1',
      featureIds: ['2'],
    };

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );
  });

  test('should throw an error if feature repeated', async () => {
    const userPayload = {
      id: '1',
      featureGroupId: '1',
      featureIds: ['1'],
    };

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.repeatedFeatures,
    );
  });

  test('should be a update an user', async () => {
    const featureTwo = await featureRepository.create({
      id: '2',
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    const featureThree = await featureRepository.create({
      id: '3',
      key: 'feature-key-3',
      name: 'Feature Name 3',
    });

    await featureGroupRepository.create({
      id: '2',
      key: 'feature-group-key-2',
      name: 'Feature Group Name 2',
      features: [featureTwo],
    });

    const userPayload = {
      id: '1',
      name: 'John Doe Update',
      email: 'johndoeupdate@example.com',
      password: '123456789',
      featureGroupId: '2',
      featureIds: [featureThree.id],
    };

    jest.spyOn(userRepository, 'save');

    const newUser = await updateUsersService.execute(userPayload);

    expect(userRepository.save).toHaveBeenCalledTimes(1);

    expect(newUser.name).not.toEqual(user.name);
    expect(newUser.email).not.toEqual(user.email);
    expect(newUser.password).not.toEqual(user.password);
    expect(newUser.featureGroupId).not.toEqual(user.featureGroupId);
    expect(newUser.standaloneFeatures).not.toEqual(user.standaloneFeatures);
    expect(newUser.standaloneFeatures?.length).toEqual(1);
  });
});
