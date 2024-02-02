import { TestAppDataSource } from '@shared/infra/http/data-source';

import FeatureGroupRepository from '../infra/typeorm/repositories/feature-group.repository';

import DeleteFeatureGroupsService from './delete-feature-groups.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let featureGroupRepository: FeatureGroupRepository;
let deleteFeatureGroupsService: DeleteFeatureGroupsService;

describe('DeleteFeatureGroupsService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    featureGroupRepository = new FeatureGroupRepository();
    deleteFeatureGroupsService = new DeleteFeatureGroupsService(
      featureGroupRepository,
    );

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'feature-group-name',
      features: [],
    });

    container.reset();

    container.register('FeatureGroupRepository', {
      useValue: featureGroupRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(featureGroupRepository).toBeDefined();
    expect(deleteFeatureGroupsService).toBeDefined();
  });

  test('should throw an error if no feature group is found by id', async () => {
    const payload = {
      id: 'non-existing-feature-group-id',
    };

    jest.spyOn(featureGroupRepository, 'findById');

    await expect(
      deleteFeatureGroupsService.execute(payload.id),
    ).rejects.toThrow(AppErrorTypes.featureGroups.notFound);

    expect(featureGroupRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be delete a feature group if a feature group is found by id', async () => {
    const payload = {
      id: '1',
    };

    jest.spyOn(featureGroupRepository, 'findById');
    jest.spyOn(featureGroupRepository, 'delete');

    await deleteFeatureGroupsService.execute(payload.id),
      expect(featureGroupRepository.findById).toHaveBeenCalledWith(payload.id);

    expect(featureGroupRepository.findById).toHaveBeenCalledTimes(1);

    expect(featureGroupRepository.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: payload.id,
      }),
    );

    expect(featureGroupRepository.delete).toHaveBeenCalledTimes(1);
  });
});
