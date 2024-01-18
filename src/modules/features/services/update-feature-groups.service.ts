import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';
import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';
import Feature from '../infra/typeorm/entities/feature.entity';

interface UpdateFeatureGroupsServiceDTO {
  featureGroupId: string;
  key?: string;
  name?: string;
  featureIds?: string[];
}

@injectable()
export default class UpdateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,

    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute({
    featureGroupId,
    key,
    name,
    featureIds,
  }: UpdateFeatureGroupsServiceDTO): Promise<FeatureGroup> {
    const featureGroup = await this.featureGroupRepository.findById(
      featureGroupId,
    );

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound);
    }

    if (key || name) {
      const checkFeatureGroupsExists =
        await this.featureGroupRepository.findByKeyOrName({
          key,
          name,
        });

      if (checkFeatureGroupsExists.length > 0) {
        const featureExists = checkFeatureGroupsExists.find(
          (feature) => feature.key === key,
        );

        if (featureExists) {
          throw new AppError(AppErrorTypes.featureGroups.keyAlreadyRegistered);
        }
        throw new AppError(AppErrorTypes.featureGroups.nameAlreadyRegistered);
      }

      featureGroup.key = key || featureGroup.key;
      featureGroup.name = name || featureGroup.name;
    }

    if (featureIds) {
      let features: Feature[] = [];

      for (let featureId of featureIds) {
        const feature = await this.featureRepository.findById(featureId);

        if (feature) {
          features.push(feature);
        }
      }

      if (features.length === 0) {
        throw new AppError(AppErrorTypes.features.notFound);
      }

      featureGroup.features = features;
    }

    return await this.featureGroupRepository.save(featureGroup);
  }
}