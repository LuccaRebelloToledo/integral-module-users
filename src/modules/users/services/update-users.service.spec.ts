import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import FakeFeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository.fake';
import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import User from '../infra/typeorm/entities/user.entity';

import UpdateUsersService from './update-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureRepository: FakeFeatureRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let updateUsersService: UpdateUsersService;
let user: User;

describe('UpdateUsersService', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureRepository = new FakeFeatureRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    updateUsersService = new UpdateUsersService(
      fakeUserRepository,
      hashProvider,
    );

    container.reset();

    container.register('UserRepository', {
      useValue: fakeUserRepository,
    });

    container.register('FeatureGroupRepository', {
      useValue: fakeFeatureGroupRepository,
    });

    container.register('FeatureRepository', {
      useValue: fakeFeatureRepository,
    });

    const feature = await fakeFeatureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'Feature Name',
    });

    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [feature],
    });

    user = await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
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
    expect(updateUsersService).toBeDefined();
    expect(user).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userPayload = {
      id: 'non-existing-user-id',
    };

    jest.spyOn(fakeUserRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(fakeUserRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(fakeUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if user is found by email', async () => {
    await fakeUserRepository.create({
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

    jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledWith(
      userPayload.email,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    const userPayload = {
      id: '1',
      featureGroupId: '2',
    };

    jest.spyOn(fakeFeatureGroupRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature is found by id', async () => {
    const userPayload = {
      id: '1',
      featureIds: ['2'],
    };

    jest.spyOn(fakeFeatureRepository, 'findById');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(fakeFeatureRepository.findById).toHaveBeenCalledWith(
      userPayload.featureIds[0],
    );

    expect(fakeFeatureRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if feature repeated', async () => {
    const userPayload = {
      id: '1',
      featureGroupId: '1',
      featureIds: ['1'],
    };

    jest.spyOn(fakeFeatureRepository, 'findById');
    jest.spyOn(fakeFeatureRepository, 'findAllFeaturesByFeatureGroupId');
    jest.spyOn(fakeFeatureRepository, 'findAllByUserId');

    await expect(updateUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.features.repeatedFeatures,
    );

    expect(fakeFeatureRepository.findById).toHaveBeenCalledWith(
      userPayload.featureIds[0],
    );
    expect(fakeFeatureRepository.findById).toHaveBeenCalledTimes(1);

    expect(
      fakeFeatureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledWith(userPayload.featureGroupId);
    expect(
      fakeFeatureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledTimes(1);

    expect(fakeFeatureRepository.findAllByUserId).toHaveBeenCalledWith(
      userPayload.id,
    );
    expect(fakeFeatureRepository.findAllByUserId).toHaveBeenCalledTimes(1);
  });

  test('should be a update an user', async () => {
    const featureTwo = await fakeFeatureRepository.create({
      id: '2',
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    const featureThree = await fakeFeatureRepository.create({
      id: '3',
      key: 'feature-key-3',
      name: 'Feature Name 3',
    });

    await fakeFeatureGroupRepository.create({
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

    jest.spyOn(fakeUserRepository, 'save');

    const newUser = await updateUsersService.execute(userPayload);

    expect(fakeUserRepository.save).toHaveBeenCalledTimes(1);

    expect(newUser.name).not.toEqual(user.name);
    expect(newUser.email).not.toEqual(user.email);
    expect(newUser.password).not.toEqual(user.password);
    expect(newUser.featureGroupId).not.toEqual(user.featureGroupId);
    expect(newUser.standaloneFeatures).not.toEqual(user.standaloneFeatures);
    expect(newUser.standaloneFeatures?.length).toEqual(1);
  });
});
