import TestAppDataSource from '@shared/infra/typeorm/data-sources/test-data-source';

import { container } from 'tsyringe';

import FeatureGroupsRepository from '../infra/typeorm/repositories/feature-groups.repository';

import DeleteFeatureGroupsService from './delete-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

describe('DeleteFeatureGroupsService', () => {
  let featureGroupsRepository: FeatureGroupsRepository;
  let deleteFeatureGroupsService: DeleteFeatureGroupsService;

  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupsRepository = new FeatureGroupsRepository();
    deleteFeatureGroupsService = new DeleteFeatureGroupsService(
      featureGroupsRepository,
    );

    container.reset();

    container.register('FeatureGroupsRepository', {
      useValue: featureGroupsRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupsRepository).toBeDefined();
    expect(deleteFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if no feature group is found by id', async () => {
    const payload = {
      id: 'non-existing-feature-group-id',
    };

    jest.spyOn(featureGroupsRepository, 'findById');

    await expect(
      deleteFeatureGroupsService.execute(payload.id),
    ).rejects.toThrow(AppErrorTypes.featureGroups.notFound);

    expect(featureGroupsRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be delete a feature group if a feature group is found by id', async () => {
    const featureGroup = await featureGroupsRepository.create({
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });

    const payload = {
      id: featureGroup.id,
    };

    jest.spyOn(featureGroupsRepository, 'findById');
    jest.spyOn(featureGroupsRepository, 'delete');

    await deleteFeatureGroupsService.execute(payload.id),
      expect(featureGroupsRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupsRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureGroupsRepository.delete).toHaveBeenCalledWith(payload.id);

    expect(featureGroupsRepository.delete).toHaveBeenCalledTimes(1);
  });
});
