import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import User from '../infra/typeorm/entities/user.entity';

import UpdateUsersService from './update-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let usersRepository: UsersRepository;
let featuresRepository: FeaturesRepository;
let featureGroupsRepository: FeatureGroupsRepository;
let hashProvider: BCryptHashProvider;
let updateUsersService: UpdateUsersService;
let user: User;

describe('UpdateUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    hashProvider = new BCryptHashProvider();
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
      id: '1',
      key: 'feature-key',
      name: 'Feature Name',
    });

    await featureGroupsRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [feature],
    });

    user = await usersRepository.create({
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
    expect(usersRepository).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(updateUsersService).toBeDefined();
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
      id: '2',
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    const userPayload = {
      id: '1',
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
      id: '1',
      featureGroupId: '2',
      name: 'John Doe',
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

  test('should throw an error if no feature is found by id', async () => {
    const userPayload = {
      id: '1',
      name: 'John Doe',
      featureIds: ['2'],
    };

    jest.spyOn(featuresRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featuresRepository.findById).toHaveBeenCalledWith(
      userPayload.featureIds[0],
    );

    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if feature repeated', async () => {
    const userPayload = {
      id: '1',
      name: 'John Doe',
      featureGroupId: '1',
      featureIds: ['1'],
    };

    jest.spyOn(featureGroupsRepository, 'findById');
    jest.spyOn(featuresRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.repeatedFeatures,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);

    expect(featuresRepository.findById).toHaveBeenCalledWith(
      userPayload.featureIds[0],
    );

    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be a update an user', async () => {
    const featureTwo = await featuresRepository.create({
      id: '2',
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    const featureThree = await featuresRepository.create({
      id: '3',
      key: 'feature-key-3',
      name: 'Feature Name 3',
    });

    await featureGroupsRepository.create({
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

    jest.spyOn(usersRepository, 'findByEmail');
    jest.spyOn(featureGroupsRepository, 'findById');
    jest.spyOn(featuresRepository, 'findById');
    jest.spyOn(usersRepository, 'save');

    const newUser = await updateUsersService.execute(userPayload);

    expect(usersRepository.save).toHaveBeenCalledTimes(1);

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);

    expect(featuresRepository.findById).toHaveBeenCalledWith(
      userPayload.featureIds[0],
    );
    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );
    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);

    expect(newUser.name).not.toEqual(user.name);
    expect(newUser.email).not.toEqual(user.email);
    expect(newUser.password).not.toEqual(user.password);
    expect(newUser.featureGroupId).not.toEqual(user.featureGroupId);
    expect(newUser.standaloneFeatures).not.toEqual(user.standaloneFeatures);
    expect(newUser.standaloneFeatures?.length).toEqual(1);
  });
});
