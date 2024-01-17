import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';
import Feature from '../infra/typeorm/entities/feature.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class ShowFeaturesService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute(): Promise<Feature[]> {
    const features = await this.featureRepository.findAll();

    if (!features || features.length === 0) {
      throw new AppError(AppErrorTypes.features.notFound);
    }

    return features;
  }
}
