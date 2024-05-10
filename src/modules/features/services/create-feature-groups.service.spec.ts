import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';
import FeaturesRepository from '../infra/typeorm/repositories/features.repository';
import Feature from '../infra/typeorm/entities/feature.entity';

import CreateFeatureGroupsService from './create-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let featureGroupsRepository: FeatureGroupsRepository;
let featuresRepository: FeaturesRepository;
let feature: Feature;
let createFeatureGroupsService: CreateFeatureGroupsService;

describe('CreateFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    featuresRepository = new FeaturesRepository();
    createFeatureGroupsService = new CreateFeatureGroupsService(
      featureGroupsRepository,
    );

    await featureGroupsRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });

    feature = await featuresRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });

    container.reset();

    container.register('FeaturesRepository', {
      useValue: featuresRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupsRepository).toBeDefined();
    expect(featuresRepository).toBeDefined();
    expect(feature).toBeDefined();
    expect(createFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if feature group is found by key', async () => {
    const payload = {
      key: 'feature-group-key',
      name: 'non-existing-feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.keyAlreadyRegistered,
    );

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if feature group is found by name', async () => {
    const payload = {
      key: 'non-existing-feature-group-key',
      name: 'feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.nameAlreadyRegistered,
    );

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledWith({
      key: payload.key,
      name: payload.name,
    });

    expect(featureGroupsRepository.findByKeyOrName).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if no feature is found', async () => {
    const payload = {
      key: 'new-feature-group-key',
      name: 'new-feature-group-name',
      featureIds: ['no-existing-feature-id'],
    };

    jest.spyOn(featuresRepository, 'findById');

    await expect(createFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featuresRepository.findById).toHaveBeenCalledWith(
      payload.featureIds[0],
    );

    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be create a feature group', async () => {
    const payload = {
      key: 'feature-group-key-2',
      name: 'feature-group-name-2',
      featureIds: ['1'],
    };

    jest.spyOn(featureGroupsRepository, 'create');
    jest.spyOn(featureGroupsRepository, 'save');

    const featureGroup = await createFeatureGroupsService.execute(payload);

    expect(featureGroupsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.anything(),
        key: payload.key,
        name: payload.name,
        features: [feature],
      }),
    );

    expect(featureGroupsRepository.create).toHaveBeenCalledTimes(1);
    expect(featureGroupsRepository.save).toHaveBeenCalledTimes(1);

    expect(featureGroup).toHaveProperty('id');
    expect(featureGroup).toHaveProperty('createdAt');
    expect(featureGroup).toHaveProperty('updatedAt');

    expect(featureGroup.key).toEqual(payload.key);
    expect(featureGroup.name).toEqual(payload.name);
    expect(featureGroup.features[0].id).toEqual(feature.id);
  });
});
