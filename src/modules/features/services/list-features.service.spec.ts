import { TestAppDataSource } from '@shared/infra/http/data-source';

import FeatureRepository from '../infra/typeorm/repositories/feature.repository';

import ListFeaturesService from './list-features.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { convertPageAndLimitToInt } from '@shared/utils/convert-page-and-limit-to-int.utils';
import { calculateSkip } from '@shared/utils/calculate-skip.utils';

let featureRepository: FeatureRepository;
let listFeaturesService: ListFeaturesService;

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

describe('ListFeaturesService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureRepository = new FeatureRepository();
    listFeaturesService = new ListFeaturesService(featureRepository);
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureRepository).toBeDefined();
    expect(listFeaturesService).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    jest.spyOn(featureRepository, 'findAll');

    await expect(listFeaturesService.execute(payload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featureRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureRepository.findAll).toHaveBeenCalledTimes(1);
  });

  test('should be return a list of feature groups', async () => {
    const featureOne = await featureRepository.create({
      id: '1',
      key: 'feature-key-1',
      name: 'Feature Name 1',
    });

    const featureTwo = await featureRepository.create({
      id: '2',
      key: 'feature-key-2',
      name: 'Feature Name 2',
    });

    jest.spyOn(featureRepository, 'findAll');

    const { pagination, totalItems, items } =
      await listFeaturesService.execute(payload);

    expect(featureRepository.findAll).toHaveBeenCalledWith(payloadParsed);

    expect(featureRepository.findAll).toHaveBeenCalledTimes(1);

    expect(pagination.current).toEqual(pageParsed);
    expect(items).toHaveLength(2);
    expect(totalItems).toEqual(2);
    expect(items[0].id).toEqual(featureOne.id);
    expect(items[1].id).toEqual(featureTwo.id);
  });
});
