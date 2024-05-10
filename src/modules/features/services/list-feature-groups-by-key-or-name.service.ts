import { inject, injectable } from 'tsyringe';

import FindFeatureGroupsByKeyOrNameDTO from '../dtos/find-feature-groups-by-key-or-name.dto';

import FeatureGroupsRepositoryInterface from '../repositories/feature-groups.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

@injectable()
export default class ListFeatureGroupsByKeyOrNameService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: FeatureGroupsRepositoryInterface,
  ) {}

  public async execute({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]> {
    const featureGroups = await this.featureGroupsRepository.findByKeyOrName({
      key,
      name,
    });

    if (!featureGroups.length) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    return featureGroups;
  }
}
