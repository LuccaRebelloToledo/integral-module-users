import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';
import ListUsersService from './list-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';

let usersRepository: UsersRepository;
let featureGroupRepository: FeatureGroupRepository;
let listUsersService: ListUsersService;

const payload = {
  page: 1,
  limit: 5,
  sort: 'createdAt',
  order: 'DESC',
  name: undefined,
  email: undefined,
};

const skip = calculateSkip(payload.page, payload.limit);

const payloadParsed = {
  take: payload.limit,
  skip: skip,
  sort: 'createdAt',
  order: 'DESC',
  name: undefined,
  email: undefined,
};

describe('ListUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupRepository = new FeatureGroupRepository();
    listUsersService = new ListUsersService(usersRepository);

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

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
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
    const userOne = await usersRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    const userTwo = await usersRepository.create({
      id: '2',
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    jest.spyOn(usersRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listUsersService.execute(payload);

    expect(usersRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(usersRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(payload.page);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);
    expect(items[0].id).toEqual(userOne.id);
    expect(items[1].id).toEqual(userTwo.id);
  });
});
