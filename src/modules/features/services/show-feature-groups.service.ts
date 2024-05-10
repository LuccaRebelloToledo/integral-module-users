import { inject, injectable } from 'tsyringe';

import FeatureGroupsRepositoryInterface from '../repositories/feature-groups.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

@injectable()
export default class ShowFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: FeatureGroupsRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<FeatureGroup> {
    const featureGroup =
      await this.featureGroupsRepository.findById(featureGroupId);

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    return featureGroup;
  }
}
