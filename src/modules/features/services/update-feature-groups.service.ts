import { container, inject, injectable } from 'tsyringe';

import UpdateFeatureGroupsServiceDTO from '../dtos/update-feature-groups-service.dto';

import FeatureGroupsRepositoryInterface from '../repositories/feature-groups.repository.interface';

import ShowFeatureGroupsService from './show-feature-groups.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import { getFeaturesByFeatureIds } from '@shared/utils/get-features-by-feature-ids.utils';

@injectable()
export default class UpdateFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: FeatureGroupsRepositoryInterface,
  ) {}

  public async execute({
    featureGroupId,
    key,
    name,
    featureIds,
  }: UpdateFeatureGroupsServiceDTO): Promise<FeatureGroup> {
    const featureGroup = await this.validateFeatureGroup(featureGroupId);

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
    const checkFeatureGroupsExists =
      await this.featureGroupsRepository.findByKeyOrName({ key, name });

    if (checkFeatureGroupsExists.length) {
      const featureExistsByKey = checkFeatureGroupsExists.find(
        (feature) => feature.key === key,
      );

      if (featureExistsByKey) {
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
