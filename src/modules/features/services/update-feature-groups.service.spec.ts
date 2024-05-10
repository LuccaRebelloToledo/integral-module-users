import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';
import FeaturesRepository from '../infra/typeorm/repositories/features.repository';

import Feature from '../infra/typeorm/entities/feature.entity';
import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import UpdateFeatureGroupsService from './update-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let featureGroupsRepository: FeatureGroupsRepository;
let featuresRepository: FeaturesRepository;
let featureOne: Feature;
let featureTwo: Feature;
let featureGroup: FeatureGroup;
let updateFeatureGroupsService: UpdateFeatureGroupsService;

describe('UpdateFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    featuresRepository = new FeaturesRepository();
    updateFeatureGroupsService = new UpdateFeatureGroupsService(
      featureGroupsRepository,
    );

    featureOne = await featuresRepository.create({
      id: '1',
      key: 'feature-key',
      name: 'feature-name',
    });

    featureGroup = await featureGroupsRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [featureOne],
    });

    featureTwo = await featuresRepository.create({
      id: '2',
      key: 'feature-key-2',
      name: 'feature-name-2',
    });

    container.reset();

    container.register('FeatureGroupsRepository', {
      useValue: featureGroupsRepository,
    });

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
    expect(featureOne).toBeDefined();
    expect(featureTwo).toBeDefined();
    expect(updateFeatureGroupsService).toBeDefined();
    expect(featureGroup).toBeDefined();
  });

  test('should throw an error if no feature group is found', async () => {
    const payload = {
      featureGroupId: 'non-existing-feature-group-id',
      key: 'feature-group-key',
      name: 'feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupsRepository, 'findById');

    await expect(updateFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.featureGroups.notFound,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(
      payload.featureGroupId,
    );

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if feature group is found by key', async () => {
    const payload = {
      featureGroupId: '1',
      key: 'feature-group-key',
      name: undefined,
      featureIds: [],
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    await expect(updateFeatureGroupsService.execute(payload)).rejects.toThrow(
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
      featureGroupId: '1',
      key: undefined,
      name: 'feature-group-name',
      featureIds: [],
    };

    jest.spyOn(featureGroupsRepository, 'findByKeyOrName');

    await expect(updateFeatureGroupsService.execute(payload)).rejects.toThrow(
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
      featureGroupId: '1',
      key: 'new-feature-group-key',
      name: 'new-feature-group-name',
      featureIds: ['non-existing-feature-id'],
    };

    jest.spyOn(featuresRepository, 'findById');

    await expect(updateFeatureGroupsService.execute(payload)).rejects.toThrow(
      AppErrorTypes.features.notFound,
    );

    expect(featuresRepository.findById).toHaveBeenCalledWith(
      payload.featureIds[0],
    );

    expect(featuresRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be update the feature group', async () => {
    const payload = {
      featureGroupId: '1',
      key: 'new-feature-group-key',
      name: 'new-feature-group-name',
      featureIds: [featureTwo.id],
    };

    jest.spyOn(featureGroupsRepository, 'save');

    const featureGroupCreated =
      await updateFeatureGroupsService.execute(payload);

    expect(featureGroupsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: featureGroup.id,
        key: payload.key,
        name: payload.name,
        features: [featureTwo],
      }),
    );

    expect(featureGroupsRepository.save).toHaveBeenCalledTimes(1);

    expect(featureGroupCreated.key).toEqual(payload.key);
    expect(featureGroupCreated.name).toEqual(payload.name);
    expect(featureGroupCreated.features[0].id).toEqual(featureTwo.id);

    expect(featureGroupCreated.key).not.toEqual(featureGroup.key);
    expect(featureGroupCreated.name).not.toEqual(featureGroup.name);
    expect(featureGroupCreated.features[0].id).not.toEqual(featureOne.id);
  });
});
