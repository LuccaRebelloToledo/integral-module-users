import { inject, injectable } from 'tsyringe';

import IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';
import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import FindByKeyOrNameDto from '../dtos/find-by-key-or-name.dto';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ShowFeatureGroupsByKeyOrNameService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute({
    key,
    name,
  }: FindByKeyOrNameDto): Promise<FeatureGroup> {
    const featureGroup = await this.featureGroupsRepository.findByKeyOrName({
      key,
      name,
    });

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    return featureGroup;
  }
}
