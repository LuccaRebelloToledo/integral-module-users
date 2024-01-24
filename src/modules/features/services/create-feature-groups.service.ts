import { inject, injectable } from 'tsyringe';

import CreateFeatureGroupsServiceDTO from '../dtos/create-feature-groups-service.dto';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';
import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import generateNanoId from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';
import Feature from '../infra/typeorm/entities/feature.entity';

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
      const featureGroupExists = checkFeatureGroupsExists.find(
        (feature) => feature.key === key,
      );

      if (featureGroupExists) {
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

    if (!features.length) {
      throw new AppError(AppErrorTypes.features.notFound);
    }

    const featureGroup = await this.featureGroupRepository.create({
      id: generateNanoId(),
      key,
      name,
      features,
    });

    return featureGroup;
  }
}
