import { TestAppDataSource } from '@shared/infra/http/data-source';

import UserRepository from '../infra/typeorm/repositories/user.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';
import ListUsersService from './list-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { convertPageAndLimitToInt } from '@shared/utils/convert-page-and-limit-to-int.utils';
import { calculateSkip } from '@shared/utils/calculate-skip.utils';

let userRepository: UserRepository;
let featureGroupRepository: FeatureGroupRepository;
let listUsersService: ListUsersService;

describe('ListUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    userRepository = new UserRepository();
    featureGroupRepository = new FeatureGroupRepository();
    listUsersService = new ListUsersService(userRepository);

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
    expect(userRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(listUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const payload = {
      page: '1',
      limit: '5',
      sort: 'createdAt',
      order: 'DESC',
      name: undefined,
      email: undefined,
    };

    const { pageParsed, limitParsed } = convertPageAndLimitToInt(
      payload.page,
      payload.limit,
    );

    const skip = calculateSkip(pageParsed, limitParsed);

    const payloadParsed = {
      take: limitParsed,
      skip: skip,
      sort: 'createdAt',
      order: 'DESC',
      name: undefined,
      email: undefined,
    };

    jest.spyOn(userRepository, 'findAll');

    await expect(listUsersService.execute(payload)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(userRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a list of users', async () => {
    const createdUserOne = await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    const createdUserTwo = await userRepository.create({
      id: '2',
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    const payload = {
      page: '1',
      limit: '5',
      sort: 'createdAt',
      order: 'DESC',
      name: undefined,
      email: undefined,
    };

    const { pageParsed, limitParsed } = convertPageAndLimitToInt(
      payload.page,
      payload.limit,
    );

    const skip = calculateSkip(pageParsed, limitParsed);

    const payloadParsed = {
      take: limitParsed,
      skip: skip,
      sort: 'createdAt',
      order: 'DESC',
      name: undefined,
      email: undefined,
    };

    jest.spyOn(userRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listUsersService.execute(payload);

    expect(userRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(userRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(pageParsed);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);
    expect(items[0].id).toEqual(createdUserOne.id);
    expect(items[1].id).toEqual(createdUserTwo.id);
  });
});