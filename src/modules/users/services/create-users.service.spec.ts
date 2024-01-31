import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';
import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import CreateUsersService from './create-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let createUsersService: CreateUsersService;

describe('CreateUsersService', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    createUsersService = new CreateUsersService(
      fakeUserRepository,
      hashProvider,
    );

    container.reset();

    container.register('FeatureGroupRepository', {
      useValue: fakeFeatureGroupRepository,
    });

    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await fakeUserRepository.create({
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
    expect(fakeFeatureGroupRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(createUsersService).toBeDefined();
  });

  test('should throw an error if user is found by email', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(createUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledWith(
      userPayload.email,
    );

    expect(fakeUserRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    const userPayload = {
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '2',
    };

    jest.spyOn(fakeFeatureGroupRepository, 'findById');

    await expect(createUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be encrypt the password', async () => {
    const userPayload = {
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    const encryptedPassword = await hashProvider.generateHash(
      userPayload.password,
    );

    expect(userPayload.password).not.toEqual(encryptedPassword);
  });

  test('should be create a user', async () => {
    const userPayload = {
      name: 'John Doe 3',
      email: 'johndoe3@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(fakeUserRepository, 'create');
    jest.spyOn(fakeUserRepository, 'save');

    const userCreated = await createUsersService.execute(userPayload);

    expect(userCreated.name).toBe(userPayload.name);
    expect(userCreated.email).toBe(userPayload.email);
    expect(userCreated.featureGroupId).toBe(userPayload.featureGroupId);

    expect(userCreated).toHaveProperty('password');

    expect(userCreated).toHaveProperty('createdAt');

    expect(userCreated).toHaveProperty('updatedAt');

    expect(fakeUserRepository.create).toHaveBeenCalledTimes(1);

    expect(fakeUserRepository.save).toHaveBeenCalledTimes(1);
  });
});
