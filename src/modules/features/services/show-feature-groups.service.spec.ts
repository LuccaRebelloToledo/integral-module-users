import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';
import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ShowFeatureGroupsService from './show-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ShowFeatureGroupsService', () => {
  let featureGroupsRepository: FeatureGroupsRepository;
  let showFeatureGroupsService: ShowFeatureGroupsService;
  let featureGroup: FeatureGroup;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    showFeatureGroupsService = new ShowFeatureGroupsService(
      featureGroupsRepository,
    );

    featureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupsRepository).toBeDefined();
    expect(showFeatureGroupsService).toBeDefined();
    expect(featureGroup).toBeDefined();
  });

  test('should throw an error if no feature group is found', async () => {
    const payload = {
      id: 'non-existing-feature-group-id',
    };

    jest.spyOn(featureGroupsRepository, 'findById');

    await expect(showFeatureGroupsService.execute(payload.id)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a feature group if a feature group is found by id', async () => {
    const payload = {
      id: featureGroup.id,
    };

    jest.spyOn(featureGroupsRepository, 'findById');

    const featureGroupFound = await showFeatureGroupsService.execute(
      payload.id,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(payload.id);
    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureGroupFound.id).toEqual(featureGroup.id);
    expect(featureGroupFound.name).toEqual(featureGroup.name);
    expect(featureGroupFound.key).toEqual(featureGroup.key);

    expect(featureGroupFound).toHaveProperty('createdAt');
    expect(featureGroupFound).toHaveProperty('updatedAt');
  });
});
