import { TestAppDataSource } from '@shared/infra/http/data-source';

import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';
import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ListFeatureGroupsByKeyOrNameService from './list-feature-groups-by-key-or-name.service';

import AppErrorTypes from '@shared/errors/app-error-types';

let featureGroupRepository: FeatureGroupRepository;
let featureGroup: FeatureGroup;
let listFeatureGroupsByKeyOrNameService: ListFeatureGroupsByKeyOrNameService;

describe('ListFeatureGroupsByKeyOrNameService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupRepository = new FeatureGroupRepository();
    listFeatureGroupsByKeyOrNameService =
      new ListFeatureGroupsByKeyOrNameService(featureGroupRepository);

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
    expect(listFeatureGroupsByKeyOrNameService).toBeDefined();
    expect(featureGroup).toBeDefined();
  });

  test('should throw an error if no feature group is found by key', async () => {
    const payload = {
      key: 'non-existing-feature-group-key',
      name: 'non-existing-feature-group-name',
    };

    jest.spyOn(featureGroupRepository, 'findByKeyOrName');

    await expect(
      listFeatureGroupsByKeyOrNameService.execute({
        key: payload.key,
        name: payload.name,
      }),
    ).rejects.toThrow(AppErrorTypes.featureGroups.notFound);

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should return a feature group if a feature group is found by key or name', async () => {
    const payload = {
      key: 'feature-group-key',
      name: 'non-existing-feature-group-name',
    };

    jest.spyOn(featureGroupRepository, 'findByKeyOrName');

    const featureGroupFound = await listFeatureGroupsByKeyOrNameService.execute(
      {
        key: payload.key,
        name: payload.name,
      },
    );

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledTimes(1);

    expect(featureGroupFound[0].id).toEqual(featureGroup.id);
    expect(featureGroupFound[0].name).toEqual(featureGroup.name);
    expect(featureGroupFound[0].key).toEqual(featureGroup.key);

    expect(featureGroupFound[0]).toHaveProperty('createdAt');
    expect(featureGroupFound[0]).toHaveProperty('updatedAt');
  });
});
