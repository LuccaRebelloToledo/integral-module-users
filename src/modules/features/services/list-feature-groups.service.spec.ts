import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';

import ListFeatureGroupsService from './list-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';

let featureGroupsRepository: FeatureGroupsRepository;
let listFeatureGroupsService: ListFeatureGroupsService;

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

describe('ListFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    listFeatureGroupsService = new ListFeatureGroupsService(
      featureGroupsRepository,
    );
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupsRepository).toBeDefined();
    expect(listFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if no feature group is found', async () => {
    jest.spyOn(featureGroupsRepository, 'findAll');

    await expect(listFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupsRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureGroupsRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should be return a list of feature groups', async () => {
    const featureGroupOne = await featureGroupsRepository.create({
      id: '1',
      key: 'feature-group-key-1',
      name: 'Feature Group Name-1',
      features: [],
    });

    const featureGroupTwo = await featureGroupsRepository.create({
      id: '2',
      key: 'feature-group-key-2',
      name: 'Feature Group Name-2',
      features: [],
    });

    jest.spyOn(featureGroupsRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listFeatureGroupsService.execute(payload);

    expect(featureGroupsRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureGroupsRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(payload.page);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);
    expect(items[0].id).toEqual(featureGroupOne.id);
    expect(items[1].id).toEqual(featureGroupTwo.id);
  });
});
