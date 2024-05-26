import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import ListUsersService from './list-users.service';

import calculateSkip from '@shared/utils/calculate-skip.utils';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ListUsersService', () => {
  let usersRepository: UsersRepository;
  let featureGroupsRepository: FeatureGroupsRepository;
  let listUsersService: ListUsersService;

  const payload = {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    order: 'DESC',
  };

  const skip = calculateSkip(payload.page, payload.limit);

  const payloadParsed = {
    take: payload.limit,
    skip: skip,
    sort: 'createdAt',
    order: 'DESC',
  };

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    listUsersService = new ListUsersService(usersRepository);
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(listUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    jest.spyOn(usersRepository, 'findAll');

    await expect(listUsersService.execute(payload)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(usersRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(usersRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should be return a list of users', async () => {
    const featureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    const userOne = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: featureGroup.id,
    });

    const userTwo = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: featureGroup.id,
    });

    jest.spyOn(usersRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listUsersService.execute(payload);

    expect(usersRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(usersRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(payload.page);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);

    expect(items.map((item) => item.id)).toContain(userOne.id);
    expect(items.map((item) => item.id)).toContain(userTwo.id);
  });
});
