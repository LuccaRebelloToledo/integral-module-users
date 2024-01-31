import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';
import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import BCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider';

import CreateUsersService from './create-users.service';

import AppError from '@shared/errors/app-error';

import { container } from 'tsyringe';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let hashProvider: BCryptHashProvider;
let createUsersService: CreateUsersService;

describe('CreateUsersService', () => {
  beforeEach(async () => {
    container.reset();
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    hashProvider = new BCryptHashProvider();
    createUsersService = new CreateUsersService(
      fakeUserRepository,
      hashProvider,
    );

    container.register('FeatureGroupRepository', {
      useValue: fakeFeatureGroupRepository,
    });
  });

  afterEach(async () => {
    await TestDataSource.destroy();
  });

  test('should be defined', () => {
    expect(fakeUserRepository).toBeDefined();
    expect(fakeFeatureGroupRepository).toBeDefined();
    expect(hashProvider).toBeDefined();
    expect(createUsersService).toBeDefined();
  });

  test('should throw an error if user is found by email', async () => {
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

    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(
      createUsersService.execute(userPayload),
    ).rejects.toBeInstanceOf(AppError);
    expect(fakeUserRepository.findByEmail).toHaveBeenCalledWith(
      userPayload.email,
    );
    expect(fakeUserRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature group is found by id', async () => {
    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '2',
    };

    jest.spyOn(fakeFeatureGroupRepository, 'findById');

    await expect(
      createUsersService.execute(userPayload),
    ).rejects.toBeInstanceOf(AppError);
    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledWith(
      userPayload.featureGroupId,
    );
    expect(fakeFeatureGroupRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be encrypt the password', async () => {
    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(hashProvider, 'generateHash');

    await createUsersService.execute(userPayload);
    const userCreated = await fakeUserRepository.findByEmail(userPayload.email);

    const encryptedPasswordDecoded = await hashProvider.compareHash(
      userPayload.password,
      userCreated!.password,
    );

    expect(encryptedPasswordDecoded).toBeTruthy();
    expect(hashProvider.generateHash).toHaveBeenCalledWith(
      userPayload.password,
    );
    expect(hashProvider.generateHash).toHaveBeenCalledTimes(1);
  });

  test('should be create a user', async () => {
    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    };

    jest.spyOn(fakeUserRepository, 'create');
    jest.spyOn(fakeUserRepository, 'save');

    await createUsersService.execute(userPayload);

    const userCreated = await fakeUserRepository.findByEmail(userPayload.email);

    expect(userCreated).toHaveProperty('id');
    expect(userCreated).toHaveProperty('createdAt');
    expect(userCreated).toHaveProperty('updatedAt');
    expect(fakeUserRepository.create).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.save).toHaveBeenCalledTimes(1);
  });
});
