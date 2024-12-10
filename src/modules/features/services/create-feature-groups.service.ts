import { inject, injectable } from 'tsyringe';

import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';
import type IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';

import type CreateFeatureGroupsServiceDto from '../dtos/create-feature-groups-service.dto';

import getFeaturesByFeatureIds from '@shared/utils/get-features-by-feature-ids.util';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class CreateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private readonly featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute({
    key,
    name,
    featureIds,
  }: CreateFeatureGroupsServiceDto): Promise<FeatureGroup> {
    await this.checkFeatureGroupExists(key, name);

    const features = await getFeaturesByFeatureIds(featureIds);

    const featureGroup = await this.featureGroupsRepository.create({
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
