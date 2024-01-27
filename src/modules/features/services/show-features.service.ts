import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import Feature from '../infra/typeorm/entities/feature.entity';
@injectable()
export default class ShowFeaturesService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute(featureId: string): Promise<Feature> {
    const feature = await this.featureRepository.findById(featureId);

    if (!feature) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
    }

    return feature;
  }
}
