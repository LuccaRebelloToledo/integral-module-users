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
    const keyInput = key.trim();
    const nameInput = name.trim();

    const checkFeatureGroupsExists =
      await this.featureGroupRepository.findByKeyOrName({
        key: keyInput,
        name: nameInput,
      });

    if (checkFeatureGroupsExists.length > 0) {
      const featureExists = checkFeatureGroupsExists.find(
        (feature) => feature.key === keyInput,
      );

      if (featureExists) {
        throw new AppError(AppErrorTypes.featureGroups.keyAlreadyRegistered);
      }
      throw new AppError(AppErrorTypes.featureGroups.nameAlreadyRegistered);
    }

    let features: Feature[] = [];

    for (let featureId of featureIds) {
      const featureIdInput = featureId.trim();

      const feature = await this.featureRepository.findById(featureIdInput);

      if (feature) {
        features.push(feature);
      }
    }

    if (features.length === 0) {
      throw new AppError(AppErrorTypes.features.notFound);
    }

    const featureGroup = await this.featureGroupRepository.create({
      key: keyInput,
      name: nameInput,
      features,
    });

    return featureGroup;
  }
}
