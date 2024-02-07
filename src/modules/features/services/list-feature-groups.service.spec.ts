import { TestAppDataSource } from '@shared/infra/http/test-data-source';

import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';

import ListFeatureGroupsService from './list-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { convertPageAndLimitToInt } from '@shared/utils/convert-page-and-limit-to-int.utils';
import { calculateSkip } from '@shared/utils/calculate-skip.utils';

let featureGroupRepository: FeatureGroupRepository;
let listFeatureGroupsService: ListFeatureGroupsService;

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

describe('ListFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupRepository = new FeatureGroupRepository();
    listFeatureGroupsService = new ListFeatureGroupsService(
      featureGroupRepository,
    );
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupRepository).toBeDefined();
    expect(listFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if no feature group is found', async () => {
    jest.spyOn(featureGroupRepository, 'findAll');

    await expect(listFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureGroupRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should be return a list of feature groups', async () => {
    const featureGroupOne = await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key-1',
      name: 'Feature Group Name-1',
      features: [],
    });

    const featureGroupTwo = await featureGroupRepository.create({
      id: '2',
      key: 'feature-group-key-2',
      name: 'Feature Group Name-2',
      features: [],
    });

    jest.spyOn(featureGroupRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listFeatureGroupsService.execute(payload);

    expect(featureGroupRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureGroupRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(pageParsed);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);
    expect(items[0].id).toEqual(featureGroupOne.id);
    expect(items[1].id).toEqual(featureGroupTwo.id);
  });
});
