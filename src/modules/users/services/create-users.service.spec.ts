import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import { container } from 'tsyringe';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';
import HashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import CreateUsersService from './create-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('CreateUsersService', () => {
  let usersRepository: UsersRepository;
  let featureGroupsRepository: FeatureGroupsRepository;
  let hashProvider: HashProvider;
  let createUsersService: CreateUsersService;
  let adminFeatureGroupId: string;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    hashProvider = new HashProvider();
    createUsersService = new CreateUsersService(usersRepository, hashProvider);

    const featureGroupOne = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const adminFeatureGroup = await featureGroupsRepository.create({
      key: 'ADMIN',
      name: 'ADMIN',
      features: [],
    });

    adminFeatureGroupId = adminFeatureGroup.id;

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: featureGroupOne.id,
    });

    container.reset();

    container.register('FeatureGroupsRepository', {
      useValue: featureGroupsRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(createUsersService).toBeDefined();
    expect(adminFeatureGroupId).toBeDefined();
  });

  test('should throw an error if user is found by email', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    jest.spyOn(usersRepository, 'findByEmail');

    await expect(createUsersService.execute(userPayload)).rejects.toThrow(
      AppErrorTypes.users.emailAlreadyInUse,
    );

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
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
    };

    jest.spyOn(usersRepository, 'create');
    jest.spyOn(usersRepository, 'save');

    const userCreated = await createUsersService.execute(userPayload);

    expect(userCreated.name).toBe(userPayload.name);
    expect(userCreated.email).toBe(userPayload.email);
    expect(userCreated.featureGroupId).toBe(adminFeatureGroupId);

    expect(usersRepository.create).toHaveBeenCalledTimes(1);

    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });
});
