import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';
import FeatureRepository from '../infra/typeorm/repositories/feature.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import CreateFeatureGroupsService from './create-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let featureGroupRepository: FeatureGroupRepository;
let featureRepository: FeatureRepository;
let feature: Feature;
let createFeatureGroupsService: CreateFeatureGroupsService;

describe('CreateFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupRepository = new FeatureGroupRepository();
    featureRepository = new FeatureRepository();
    createFeatureGroupsService = new CreateFeatureGroupsService(
      featureGroupRepository,
    );

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });

    feature = await featureRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });

    container.reset();

    container.register('FeatureRepository', {
      useValue: featureRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupRepository).toBeDefined();
    expect(featureRepository).toBeDefined();
    expect(feature).toBeDefined();
    expect(createFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if feature group is found by key', async () => {
    const payload = {
      key: 'feature-group-key',
      name: 'non-existing-feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupRepository, 'findByKeyOrName');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.keyAlreadyRegistered,
    );

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if feature group is found by name', async () => {
    const payload = {
      key: 'non-existing-feature-group-key',
      name: 'feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupRepository, 'findByKeyOrName');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.nameAlreadyRegistered,
    );

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      key: 'new-feature-group-key',
      name: 'new-feature-group-name',
      featureIds: ['no-existing-feature-id'],
    };

    jest.spyOn(featureRepository, 'findById');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featureRepository.findById).toHaveBeenCalledWith(
      payload.featureIds[0],
    );

    expect(featureRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be create a feature group', async () => {
    const payload = {
      key: 'feature-group-key-2',
      name: 'feature-group-name-2',
      featureIds: ['1'],
    };

    jest.spyOn(featureGroupRepository, 'create');
    jest.spyOn(featureGroupRepository, 'save');

    const featureGroup = await createFeatureGroupsService.execute(payload);

    expect(featureGroupRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.anything(),
        key: payload.key,
        name: payload.name,
        features: [feature],
      }),
    );

    expect(featureGroupRepository.create).toHaveBeenCalledTimes(1);
    expect(featureGroupRepository.save).toHaveBeenCalledTimes(1);

    expect(featureGroup).toHaveProperty('id');
    expect(featureGroup).toHaveProperty('createdAt');
    expect(featureGroup).toHaveProperty('updatedAt');

    expect(featureGroup.key).toEqual(payload.key);
    expect(featureGroup.name).toEqual(payload.name);
    expect(featureGroup.features[0].id).toEqual(feature.id);
  });
});
