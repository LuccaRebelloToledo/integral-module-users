import { TestAppDataSource } from '@shared/infra/http/test-data-source';

import UserRepository from '../infra/typeorm/repositories/user.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';

import ShowUsersService from './show-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let userRepository: UserRepository;
let featureGroupRepository: FeatureGroupRepository;
let showUsersService: ShowUsersService;

describe('ShowUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    userRepository = new UserRepository();
    featureGroupRepository = new FeatureGroupRepository();
    showUsersService = new ShowUsersService(userRepository);

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(showUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userId = 'non-existing-user-id';

    jest.spyOn(userRepository, 'findById');

    await expect(showUsersService.execute(userId)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a user if a user is found by id', async () => {
    const createdUser = await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    jest.spyOn(userRepository, 'findById');

    const userId = '1';

    const user = await showUsersService.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);

    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual(createdUser.name);
    expect(user.email).toEqual(createdUser.email);
    expect(user.featureGroupId).toEqual(createdUser.featureGroupId);

    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
