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
    const featureGroupIdInput = featureGroupId.trim();

    const featureGroup = await this.featureGroupRepository.findById(
      featureGroupIdInput,
    );

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound);
    }

    if (key || name) {
      const keyInput = key?.trim();
      const nameInput = name?.trim();

      const checkFeatureGroupsExists =
        await this.featureGroupRepository.findByKeyOrName({
          key: keyInput,
          name: nameInput,
        });

      if (!checkFeatureGroupsExists.length) {
        const featureExistsByKey = checkFeatureGroupsExists.find(
          (feature) => feature.key === keyInput,
        );

        if (featureExistsByKey) {
          throw new AppError(AppErrorTypes.featureGroups.keyAlreadyRegistered);
        }

        throw new AppError(AppErrorTypes.featureGroups.nameAlreadyRegistered);
      }

      featureGroup.key = keyInput || featureGroup.key;
      featureGroup.name = nameInput || featureGroup.name;
    }

    if (featureIds) {
      let features: Feature[] = [];

      for (let featureId of featureIds) {
        const featureIdInput = featureId.trim();

        const feature = await this.featureRepository.findById(featureIdInput);

        if (feature) {
          features.push(feature);
        }
      }

      if (!features.length) {
        throw new AppError(AppErrorTypes.features.notFound);
      }

      featureGroup.features = features;
    }

    return await this.featureGroupRepository.save(featureGroup);
  }
}
