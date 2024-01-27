import { inject, injectable } from 'tsyringe';

import CreateFeatureGroupsServiceDTO from '../dtos/create-feature-groups-service.dto';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import { generateNanoId } from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import { getFeaturesByFeatureIds } from '@shared/utils/get-features-by-feature-ids.utils';

@injectable()
export default class CreateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
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

    const features = await getFeaturesByFeatureIds(featureIds);

    const featureGroup = await this.featureGroupRepository.create({
      id: generateNanoId(),
      key,
      name,
      features,
    });

    return featureGroup;
  }
}
