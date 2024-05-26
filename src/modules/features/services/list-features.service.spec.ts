import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '../infra/typeorm/repositories/features.repository';

import ListFeaturesService from './list-features.service';

import calculateSkip from '@shared/utils/calculate-skip.utils';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ListFeaturesService', () => {
  let featuresRepository: FeaturesRepository;
  let listFeaturesService: ListFeaturesService;

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

    featuresRepository = new FeaturesRepository();
    listFeaturesService = new ListFeaturesService(featuresRepository);
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featuresRepository).toBeDefined();
    expect(listFeaturesService).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    jest.spyOn(featuresRepository, 'findAll');

    await expect(listFeaturesService.execute(payload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featuresRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featuresRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should be return a list of feature groups', async () => {
    const featureOne = await featuresRepository.create({
      key: 'feature-key-1',
      name: 'Feature Name 1',
    });

    const featureTwo = await featuresRepository.create({
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    jest.spyOn(featuresRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listFeaturesService.execute(payload);

    expect(featuresRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featuresRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(payload.page);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);

    expect(items.map((item) => item.id)).toContain(featureOne.id);
    expect(items.map((item) => item.id)).toContain(featureTwo.id);
  });
});
