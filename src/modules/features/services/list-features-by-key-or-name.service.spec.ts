import { TestAppDataSource } from '@shared/infra/http/test-data-source';

import FeatureRepository from '../infra/typeorm/repositories/feature.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesByKeyOrNameService from './list-features-by-key-or-name.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featureRepository: FeatureRepository;
let feature: Feature;
let listFeaturesByKeyOrNameService: ListFeaturesByKeyOrNameService;

describe('ListFeaturesByKeyOrNameService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureRepository = new FeatureRepository();
    listFeaturesByKeyOrNameService = new ListFeaturesByKeyOrNameService(
      featureRepository,
    );

    feature = await featureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureRepository).toBeDefined();
    expect(listFeaturesByKeyOrNameService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      key: 'non-existing-feature-key',
      name: 'non-existing-feature-name',
    };

    jest.spyOn(featureRepository, 'findByKeyOrName');

    await expect(
      listFeaturesByKeyOrNameService.execute(payload),
    ).rejects.toThrow(AppErrorTypes.features.notFound);

    expect(featureRepository.findByKeyOrName).toHaveBeenCalledWith(payload);

    expect(featureRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should indeed return a list of features for a given key or name', async () => {
    const payload = {
      key: 'feature-key',
      name: undefined,
    };

    jest.spyOn(featureRepository, 'findByKeyOrName');

    const features = await listFeaturesByKeyOrNameService.execute(payload);

    expect(featureRepository.findByKeyOrName).toHaveBeenCalledWith(payload);
    expect(featureRepository.findByKeyOrName).toHaveBeenCalledTimes(1);

    expect(features[0].id).toEqual(feature.id);
    expect(features[0].name).toEqual(feature.name);
    expect(features[0].key).toEqual(feature.key);
  });
});
