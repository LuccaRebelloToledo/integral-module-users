import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';
import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';
import Feature from '../infra/typeorm/entities/feature.entity';

interface CreateFeatureGroupsServiceDTO {
  key: string;
  name: string;
  featureIds: string[];
}

@injectable()
export default class CreateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,

    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute({
    key,
    name,
    featureIds,
  }: CreateFeatureGroupsServiceDTO): Promise<FeatureGroup> {
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

    const featureGroup = await this.featureGroupRepository.create({
      key,
      name,
      features,
    });

    return featureGroup;
  }
}