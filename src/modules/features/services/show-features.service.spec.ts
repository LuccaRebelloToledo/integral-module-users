import { TestAppDataSource } from '@shared/infra/http/data-source';

import FeatureRepository from '../infra/typeorm/repositories/feature.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ShowFeaturesService from './show-features.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featureRepository: FeatureRepository;
let feature: Feature;
let showFeaturesService: ShowFeaturesService;

describe('ShowFeaturesService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureRepository = new FeatureRepository();
    showFeaturesService = new ShowFeaturesService(featureRepository);

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
    expect(showFeaturesService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      id: 'non-existing-feature-id',
    };

    jest.spyOn(featureRepository, 'findById');

    await expect(showFeaturesService.execute(payload.id)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featureRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a feature if a feature is found by id', async () => {
    const payload = {
      id: '1',
    };

    jest.spyOn(featureRepository, 'findById');

    const featureFound = await showFeaturesService.execute(payload.id);

    expect(featureRepository.findById).toHaveBeenCalledWith(payload.id);
    expect(featureRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureFound.id).toEqual(feature.id);
    expect(featureFound.name).toEqual(feature.name);
    expect(featureFound.key).toEqual(feature.key);

    expect(featureFound).toHaveProperty('createdAt');
    expect(featureFound).toHaveProperty('updatedAt');
  });
});
