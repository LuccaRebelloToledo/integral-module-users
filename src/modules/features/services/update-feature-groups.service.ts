import { container, inject, injectable } from 'tsyringe';

import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';
import type IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';

import type UpdateFeatureGroupsServiceDto from '../dtos/update-feature-groups-service.dto';

import ShowFeatureGroupsService from './show-feature-groups.service';

import getFeaturesByFeatureIds from '@shared/utils/get-features-by-feature-ids.util';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class UpdateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private readonly featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute({
    id,
    key,
    name,
    featureIds,
  }: UpdateFeatureGroupsServiceDto): Promise<FeatureGroup> {
    const featureGroup = await this.validateFeatureGroup(id);

    if (key || name) {
      await this.validateKeyAndName(key, name);

      if (key) {
        featureGroup.key = key;
      }

      if (name) {
        featureGroup.name = name;
      }
    }

    if (featureIds) {
      const features = await getFeaturesByFeatureIds(featureIds);

      featureGroup.features = features;
    }

    return await this.featureGroupsRepository.save(featureGroup);
  }

  private async validateFeatureGroup(
    featureGroupId: string,
  ): Promise<FeatureGroup> {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    return await showFeatureGroupsService.execute(featureGroupId);
  }

  private async validateKeyAndName(key?: string, name?: string): Promise<void> {
    const featureGroup = await this.featureGroupsRepository.findByKeyOrName({
      key,
      name,
    });

    if (featureGroup) {
      if (featureGroup.key === key) {
        throw new AppError(
          AppErrorTypes.featureGroups.keyAlreadyRegistered,
          CONFLICT,
        );
      }

      throw new AppError(
        AppErrorTypes.featureGroups.nameAlreadyRegistered,
        CONFLICT,
      );
    }
  }
}
