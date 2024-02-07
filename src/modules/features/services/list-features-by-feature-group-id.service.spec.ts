import { TestAppDataSource } from '@shared/infra/http/test-data-source';

import FeatureRepository from '../infra/typeorm/repositories/feature.repository';
import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesByFeatureGroupIdService from './list-features-by-feature-group-id.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featureRepository: FeatureRepository;
let featureGroupRepository: FeatureGroupRepository;
let feature: Feature;
let listFeaturesByFeatureGroupIdService: ListFeaturesByFeatureGroupIdService;

describe('ListFeaturesByFeatureGroupIdService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureRepository = new FeatureRepository();
    featureGroupRepository = new FeatureGroupRepository();
    listFeaturesByFeatureGroupIdService =
      new ListFeaturesByFeatureGroupIdService(featureRepository);

    feature = await featureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [feature],
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(listFeaturesByFeatureGroupIdService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      id: 'non-existing-feature--group-id',
    };

    jest.spyOn(featureRepository, 'findAllFeaturesByFeatureGroupId');

    await expect(
      listFeaturesByFeatureGroupIdService.execute(payload.id),
    ).rejects.toThrow(AppErrorTypes.features.notFound);

    expect(
      featureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledWith(payload.id);

    expect(
      featureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledTimes(1);
  });

  test('should indeed return a list of features for a given feature group ID', async () => {
    const payload = {
      id: feature.id,
    };

    jest.spyOn(featureRepository, 'findAllFeaturesByFeatureGroupId');

    const features = await listFeaturesByFeatureGroupIdService.execute(
      payload.id,
    );

    expect(
      featureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledWith(payload.id);
    expect(
      featureRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledTimes(1);

    expect(features[0].id).toEqual(feature.id);
    expect(features[0].name).toEqual(feature.name);
    expect(features[0].key).toEqual(feature.key);
  });
});
