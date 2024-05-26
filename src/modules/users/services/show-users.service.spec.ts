import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import ShowUsersService from './show-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ShowUsersService', () => {
  let usersRepository: UsersRepository;
  let featureGroupsRepository: FeatureGroupsRepository;
  let showUsersService: ShowUsersService;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    showUsersService = new ShowUsersService(usersRepository);
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(showUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userId = 'non-existing-user-id';

    jest.spyOn(usersRepository, 'findById');

    await expect(showUsersService.execute(userId)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(usersRepository.findById).toHaveBeenCalledWith(userId);

    expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a user if a user is found by id', async () => {
    const featureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: featureGroup.id,
    });

    jest.spyOn(usersRepository, 'findById');

    const user = await showUsersService.execute(createdUser.id);

    expect(usersRepository.findById).toHaveBeenCalledWith(createdUser.id);
    expect(usersRepository.findById).toHaveBeenCalledTimes(1);

    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual(createdUser.name);
    expect(user.email).toEqual(createdUser.email);
    expect(user.featureGroupId).toEqual(createdUser.featureGroupId);

    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
