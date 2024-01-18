import { inject, injectable } from 'tsyringe';

import FindFeatureGroupsByKeyOrNameDTO from '../dtos/find-feature-groups-by-key-or-name.dto';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

@injectable()
export default class ListFeatureGroupsByKeyOrNameService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]> {
    const keyInput = key?.trim();
    const nameInput = name?.trim();

    const featureGroups = await this.featureGroupRepository.findByKeyOrName({
      key: keyInput,
      name: nameInput,
    });

    if (!featureGroups.length) {
      throw new AppError(AppErrorTypes.featureGroups.notFound);
    }

    return featureGroups;
  }
}
