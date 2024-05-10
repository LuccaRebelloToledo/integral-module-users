import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '../infra/typeorm/repositories/features.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ShowFeaturesService from './show-features.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featuresRepository: FeaturesRepository;
let feature: Feature;
let showFeaturesService: ShowFeaturesService;

describe('ShowFeaturesService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featuresRepository = new FeaturesRepository();
    showFeaturesService = new ShowFeaturesService(featuresRepository);

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
    expect(showFeaturesService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      id: 'non-existing-feature-id',
    };

    jest.spyOn(featuresRepository, 'findById');

    await expect(showFeaturesService.execute(payload.id)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featuresRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a feature if a feature is found by id', async () => {
    const payload = {
      id: '1',
    };

    jest.spyOn(featuresRepository, 'findById');

    const featureFound = await showFeaturesService.execute(payload.id);

    expect(featuresRepository.findById).toHaveBeenCalledWith(payload.id);
    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureFound.id).toEqual(feature.id);
    expect(featureFound.name).toEqual(feature.name);
    expect(featureFound.key).toEqual(feature.key);

    expect(featureFound).toHaveProperty('createdAt');
    expect(featureFound).toHaveProperty('updatedAt');
  });
});
