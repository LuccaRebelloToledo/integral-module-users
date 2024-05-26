import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import { container } from 'tsyringe';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import HashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import UpdateUsersService from './update-users.service';

import User from '../infra/typeorm/entities/user.entity';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('UpdateUsersService', () => {
  let usersRepository: UsersRepository;
  let featuresRepository: FeaturesRepository;
  let featureGroupsRepository: FeatureGroupsRepository;
  let hashProvider: HashProvider;
  let updateUsersService: UpdateUsersService;
  let featureGroupId: string;
  let user: User;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    hashProvider = new HashProvider();
    updateUsersService = new UpdateUsersService(usersRepository, hashProvider);

    container.reset();

    container.register('UsersRepository', {
      useValue: usersRepository,
    });

    container.register('FeatureGroupsRepository', {
      useValue: featureGroupsRepository,
    });

    container.register('FeaturesRepository', {
      useValue: featuresRepository,
    });

    const feature = await featuresRepository.create({
      key: 'feature-key',
      name: 'Feature Name',
    });

    const featureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [feature],
    });

    featureGroupId = featureGroup.id;

    user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: featureGroup.id,
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
    expect(updateUsersService).toBeDefined();
    expect(featureGroupId).toBeDefined();
    expect(user).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userPayload = {
      id: 'non-existing-user-id',
      name: 'John Doe',
    };

    jest.spyOn(usersRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(usersRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if user is found by email', async () => {
    await usersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId,
    });

    const userPayload = {
      id: user.id,
      email: 'johndoe2@example.com',
      name: 'John Doe',
    };

    jest.spyOn(usersRepository, 'findByEmail');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    const userPayload = {
      id: user.id,
      name: 'John Doe',
      featureGroupId: '2',
    };

    jest.spyOn(featureGroupsRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be a update an user', async () => {
    const featureTwo = await featuresRepository.create({
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    const newFeatureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key-2',
      name: 'Feature Group Name 2',
      features: [featureTwo],
    });

    const userPayload = {
      id: user.id,
      name: 'John Doe Update',
      email: 'johndoeupdate@example.com',
      password: '123456789',
      featureGroupId: newFeatureGroup.id,
    };

    jest.spyOn(usersRepository, 'findByEmail');
    jest.spyOn(featureGroupsRepository, 'findById');
    jest.spyOn(usersRepository, 'save');

    const newUser = await updateUsersService.execute(userPayload);

    expect(usersRepository.save).toHaveBeenCalledTimes(1);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );
    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);

    expect(newUser.name).not.toEqual(user.name);
    expect(newUser.email).not.toEqual(user.email);
    expect(newUser.password).not.toEqual(user.password);
    expect(newUser.featureGroupId).not.toEqual(user.featureGroupId);
  });
});
