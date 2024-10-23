import { inject, injectable } from 'tsyringe';

import type IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';
import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ShowFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute(id: string): Promise<FeatureGroup> {
    const featureGroup = await this.featureGroupsRepository.findById(id);

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    return featureGroup;
  }
}
