import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

@injectable()
export default class ListFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute(): Promise<FeatureGroup[]> {
    const featureGroups = await this.featureGroupRepository.findAll();

    if (!featureGroups.length) {
      throw new AppError(AppErrorTypes.featureGroups.notFound);
    }

    return featureGroups;
  }
}
