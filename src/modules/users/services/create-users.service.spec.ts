import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import CreateUsersService from './create-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let usersRepository: UsersRepository;
let featureGroupRepository: FeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let createUsersService: CreateUsersService;

describe('CreateUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupRepository = new FeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    createUsersService = new CreateUsersService(usersRepository, hashProvider);

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await featureGroupRepository.create({
      id: '2',
      key: 'ADMIN',
      name: 'ADMIN',
      features: [],
    });

    await usersRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    container.reset();

    container.register('FeatureGroupRepository', {
      useValue: featureGroupRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
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

    jest.spyOn(usersRepository, 'findByEmail');

    await expect(createUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    const userPayload = {
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '3',
    };

    jest.spyOn(featureGroupRepository, 'findById');

    await expect(createUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);
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

  test('should be create a user with featureGroupId', async () => {
    const userPayload = {
      name: 'John Doe 3',
      email: 'johndoe3@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(featureGroupRepository, 'findById');
    jest.spyOn(usersRepository, 'create');
    jest.spyOn(usersRepository, 'save');

    const userCreated = await createUsersService.execute(userPayload);

    expect(userCreated.name).toBe(userPayload.name);
    expect(userCreated.email).toBe(userPayload.email);
    expect(userCreated.featureGroupId).toBe(userPayload.featureGroupId);

    expect(userCreated).toHaveProperty('password');

    expect(userCreated).toHaveProperty('createdAt');

    expect(userCreated).toHaveProperty('updatedAt');

    expect(featureGroupRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );

    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);

    expect(usersRepository.create).toHaveBeenCalledTimes(1);

    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });

  test('should be create a user no having featureGroupId', async () => {
    const userPayload = {
      name: 'John Doe 4',
      email: 'johndoe4@example.com',
      password: '123456',
    };

    jest.spyOn(featureGroupRepository, 'findByKeyOrName');
    jest.spyOn(usersRepository, 'create');
    jest.spyOn(usersRepository, 'save');

    const userCreated = await createUsersService.execute(userPayload);

    expect(userCreated.name).toBe(userPayload.name);
    expect(userCreated.email).toBe(userPayload.email);

    expect(userCreated).toHaveProperty('password');

    expect(userCreated).toHaveProperty('createdAt');

    expect(userCreated).toHaveProperty('updatedAt');

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledTimes(1);

    expect(usersRepository.create).toHaveBeenCalledTimes(1);

    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });
});
