import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '../infra/typeorm/repositories/features.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesByKeyOrNameService from './list-features-by-key-or-name.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featuresRepository: FeaturesRepository;
let feature: Feature;
let listFeaturesByKeyOrNameService: ListFeaturesByKeyOrNameService;

describe('ListFeaturesByKeyOrNameService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featuresRepository = new FeaturesRepository();
    listFeaturesByKeyOrNameService = new ListFeaturesByKeyOrNameService(
      featuresRepository,
    );

    feature = await featuresRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featuresRepository).toBeDefined();
    expect(listFeaturesByKeyOrNameService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      key: 'non-existing-feature-key',
      name: 'non-existing-feature-name',
    };

    jest.spyOn(featuresRepository, 'findByKeyOrName');

    await expect(
      listFeaturesByKeyOrNameService.execute(payload),
    ).rejects.toThrow(AppErrorTypes.features.notFound);

    expect(featuresRepository.findByKeyOrName).toHaveBeenCalledWith(payload);

    expect(featuresRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should indeed return a list of features for a given key or name', async () => {
    const payload = {
      key: 'feature-key',
      name: undefined,
    };

    jest.spyOn(featuresRepository, 'findByKeyOrName');

    const features = await listFeaturesByKeyOrNameService.execute(payload);

    expect(featuresRepository.findByKeyOrName).toHaveBeenCalledWith(payload);
    expect(featuresRepository.findByKeyOrName).toHaveBeenCalledTimes(1);

    expect(features[0].id).toEqual(feature.id);
    expect(features[0].name).toEqual(feature.name);
    expect(features[0].key).toEqual(feature.key);
  });
});
