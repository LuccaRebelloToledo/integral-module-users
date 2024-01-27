import { inject, injectable } from 'tsyringe';

import UpdateFeatureGroupsServiceDTO from '../dtos/update-feature-groups-service.dto';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import { getFeaturesByFeatureIds } from '@shared/utils/get-features-by-feature-ids.utils';

@injectable()
export default class UpdateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute({
    featureGroupId,
    key,
    name,
    featureIds,
  }: UpdateFeatureGroupsServiceDTO): Promise<FeatureGroup> {
    const featureGroup =
      await this.featureGroupRepository.findById(featureGroupId);

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    if (key || name) {
      const checkFeatureGroupsExists =
        await this.featureGroupRepository.findByKeyOrName({
          key,
          name,
        });

      if (!checkFeatureGroupsExists.length) {
        const featureExistsByKey = checkFeatureGroupsExists.find(
          (feature) => feature.key === key,
        );

        if (featureExistsByKey) {
          throw new AppError(AppErrorTypes.featureGroups.keyAlreadyRegistered);
        }

        throw new AppError(AppErrorTypes.featureGroups.nameAlreadyRegistered);
      }

      featureGroup.key = key || featureGroup.key;
      featureGroup.name = name || featureGroup.name;
    }

    if (featureIds) {
      const features = await getFeaturesByFeatureIds(featureIds);

      featureGroup.features = features;
    }

    return await this.featureGroupRepository.save(featureGroup);
  }
}
