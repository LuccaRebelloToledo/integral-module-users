import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';

import ShowUsersService from './show-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let showUsersService: ShowUsersService;

describe('ShowUsersService', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    showUsersService = new ShowUsersService(fakeUserRepository);

    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  test('should be defined', () => {
    expect(fakeUserRepository).toBeDefined();
    expect(fakeFeatureGroupRepository).toBeDefined();
    expect(showUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userId = 'non-existing-user-id';

    jest.spyOn(fakeUserRepository, 'findById');

    await expect(showUsersService.execute(userId)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(fakeUserRepository.findById).toHaveBeenCalledWith(userId);

    expect(fakeUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a user if a user is found by id', async () => {
    const createdUser = await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    jest.spyOn(fakeUserRepository, 'findById');

    const userId = '1';

    const user = await showUsersService.execute(userId);

    expect(fakeUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(fakeUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(user.id).toBe(createdUser.id);
    expect(user.name).toBe(createdUser.name);
    expect(user.email).toBe(createdUser.email);
    expect(user.featureGroupId).toBe(createdUser.featureGroupId);
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
