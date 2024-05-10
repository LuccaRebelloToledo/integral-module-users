import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeaturesRepository from '../infra/typeorm/repositories/features.repository';
import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesByFeatureGroupIdService from './list-features-by-feature-group-id.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featuresRepository: FeaturesRepository;
let featureGroupsRepository: FeatureGroupsRepository;
let feature: Feature;
let listFeaturesByFeatureGroupIdService: ListFeaturesByFeatureGroupIdService;

describe('ListFeaturesByFeatureGroupIdService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featuresRepository = new FeaturesRepository();
    featureGroupsRepository = new FeatureGroupsRepository();
    listFeaturesByFeatureGroupIdService =
      new ListFeaturesByFeatureGroupIdService(featuresRepository);

    feature = await featuresRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });

    await featureGroupsRepository.create({
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
    expect(featuresRepository).toBeDefined();
    expect(featureGroupsRepository).toBeDefined();
    expect(listFeaturesByFeatureGroupIdService).toBeDefined();
    expect(feature).toBeDefined();
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      id: 'non-existing-feature--group-id',
    };

    jest.spyOn(featuresRepository, 'findAllFeaturesByFeatureGroupId');

    await expect(
      listFeaturesByFeatureGroupIdService.execute(payload.id),
    ).rejects.toThrow(AppErrorTypes.features.notFound);

    expect(
      featuresRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledWith(payload.id);

    expect(
      featuresRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledTimes(1);
  });

  test('should indeed return a list of features for a given feature group ID', async () => {
    const payload = {
      id: feature.id,
    };

    jest.spyOn(featuresRepository, 'findAllFeaturesByFeatureGroupId');

    const features = await listFeaturesByFeatureGroupIdService.execute(
      payload.id,
    );

    expect(
      featuresRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledWith(payload.id);
    expect(
      featuresRepository.findAllFeaturesByFeatureGroupId,
    ).toHaveBeenCalledTimes(1);

    expect(features[0].id).toEqual(feature.id);
    expect(features[0].name).toEqual(feature.name);
    expect(features[0].key).toEqual(feature.key);
  });
});
