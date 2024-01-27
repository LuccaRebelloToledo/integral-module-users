import { inject, injectable } from 'tsyringe';

import FindFeaturesByKeyOrNameDTO from '../dtos/find-features-by-key-or-name.dto';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import Feature from '../infra/typeorm/entities/feature.entity';

@injectable()
export default class ListFeaturesByKeyOrNameService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]> {
    const features = await this.featureRepository.findByKeyOrName({
      key,
      name,
    });

    if (!features.length) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
    }

    return features;
  }
}
