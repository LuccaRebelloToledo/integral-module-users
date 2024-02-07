import { TestAppDataSource } from '@shared/infra/http/test-data-source';

import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';
import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ShowFeatureGroupsService from './show-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featureGroupRepository: FeatureGroupRepository;
let featureGroup: FeatureGroup;
let showFeatureGroupsService: ShowFeatureGroupsService;

describe('ShowFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupRepository = new FeatureGroupRepository();
    showFeatureGroupsService = new ShowFeatureGroupsService(
      featureGroupRepository,
    );

    featureGroup = await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupRepository).toBeDefined();
    expect(showFeatureGroupsService).toBeDefined();
    expect(featureGroup).toBeDefined();
  });

  test('should throw an error if no feature group is found', async () => {
    const payload = {
      id: 'non-existing-feature-group-id',
    };

    jest.spyOn(featureGroupRepository, 'findById');

    await expect(showFeatureGroupsService.execute(payload.id)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return a feature group if a feature group is found by id', async () => {
    const payload = {
      id: '1',
    };

    jest.spyOn(featureGroupRepository, 'findById');

    const featureGroupFound = await showFeatureGroupsService.execute(
      payload.id,
    );

    expect(featureGroupRepository.findById).toHaveBeenCalledWith(payload.id);
    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureGroupFound.id).toEqual(featureGroup.id);
    expect(featureGroupFound.name).toEqual(featureGroup.name);
    expect(featureGroupFound.key).toEqual(featureGroup.key);

    expect(featureGroupFound).toHaveProperty('createdAt');
    expect(featureGroupFound).toHaveProperty('updatedAt');
  });
});
