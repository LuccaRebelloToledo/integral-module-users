import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';

import ListFeatureGroupsService from './list-feature-groups.service';

import calculateSkip from '@shared/utils/calculate-skip.util';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ListFeatureGroupsService', () => {
  let featureGroupsRepository: FeatureGroupsRepository;
  let listFeatureGroupsService: ListFeatureGroupsService;

  const payload = {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    order: 'DESC',
  };

  const skip = calculateSkip({ page: payload.page, limit: payload.limit });

  const payloadParsed = {
    take: payload.limit,
    skip: skip,
    sort: 'createdAt',
    order: 'DESC',
  };

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
      key: 'feature-group-key-1',
      name: 'Feature Group Name-1',
      features: [],
    });

    const featureGroupTwo = await featureGroupsRepository.create({
      key: 'feature-group-key-2',
      name: 'Feature Group Name-2',
      features: [],
    });

    jest.spyOn(featureGroupsRepository, 'findAll');

    const { meta, data } = await listFeatureGroupsService.execute(payload);

    expect(featureGroupsRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureGroupsRepository.findAll).toHaveBeenCalledTimes(1);

    expect(meta.page).toEqual(payload.page);
    expect(meta.totalItems).toEqual(2);
    expect(data).toHaveLength(2);

    expect(data.map((item) => item.id)).toContain(featureGroupOne.id);
    expect(data.map((item) => item.id)).toContain(featureGroupTwo.id);
  });
});
