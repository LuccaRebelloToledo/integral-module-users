import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';
import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ShowFeatureGroupsByKeyOrNameService from './show-feature-groups-by-key-or-name.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('ShowFeatureGroupsByKeyOrNameService', () => {
  let featureGroupsRepository: FeatureGroupsRepository;
  let showFeatureGroupsByKeyOrNameService: ShowFeatureGroupsByKeyOrNameService;
  let featureGroup: FeatureGroup;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    showFeatureGroupsByKeyOrNameService =
      new ShowFeatureGroupsByKeyOrNameService(featureGroupsRepository);

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
    expect(showFeatureGroupsByKeyOrNameService).toBeDefined();
    expect(featureGroup).toBeDefined();
  });

  test('should throw an error if no feature group is found by key', async () => {
    const payload = {
      key: 'non-existing-feature-group-key',
      name: 'non-existing-feature-group-name',
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    await expect(
      showFeatureGroupsByKeyOrNameService.execute({
        key: payload.key,
        name: payload.name,
      }),
    ).rejects.toThrow(AppErrorTypes.featureGroups.notFound);

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should return a feature group if a feature group is found by key or name', async () => {
    const payload = {
      key: 'feature-group-key',
      name: 'non-existing-feature-group-name',
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    const foundFeatureGroup = await showFeatureGroupsByKeyOrNameService.execute(
      {
        key: payload.key,
        name: payload.name,
      },
    );

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledTimes(1);

    expect(foundFeatureGroup.id).toEqual(featureGroup.id);
    expect(foundFeatureGroup.name).toEqual(featureGroup.name);
    expect(foundFeatureGroup.key).toEqual(featureGroup.key);
  });
});
