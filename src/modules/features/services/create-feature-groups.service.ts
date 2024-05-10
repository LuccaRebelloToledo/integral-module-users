import { inject, injectable } from 'tsyringe';

import CreateFeatureGroupsServiceDTO from '../dtos/create-feature-groups-service.dto';

import FeatureGroupsRepositoryInterface from '../repositories/feature-groups.repository.interface';

import { generateNanoId } from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import { getFeaturesByFeatureIds } from '@shared/utils/get-features-by-feature-ids.utils';

@injectable()
export default class CreateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: FeatureGroupsRepositoryInterface,
  ) {}

  public async execute({
    key,
    name,
    featureIds,
  }: CreateFeatureGroupsServiceDTO): Promise<FeatureGroup> {
    await this.checkFeatureGroupExists(key, name);

    const features = await getFeaturesByFeatureIds(featureIds);

    const featureGroup = await this.featureGroupsRepository.create({
      id: generateNanoId(),
      key,
      name,
      features,
    });

    return featureGroup;
  }

  private async checkFeatureGroupExists(
    key: string,
    name: string,
  ): Promise<void> {
    const existingFeatureGroups =
      await this.featureGroupsRepository.findByKeyOrName({ key, name });

    if (existingFeatureGroups.length) {
      const existingFeatureGroup = existingFeatureGroups.find(
        (featureGroup) => featureGroup.key === key,
      );

      if (existingFeatureGroup) {
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
