import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import Feature from '../infra/typeorm/entities/feature.entity';

@injectable()
export default class ShowFeaturesByUserIdService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<Feature[]> {
    const features = await this.featureRepository.findAllByUserId(userId);

    if (!features.length) {
      throw new AppError(AppErrorTypes.features.notFound);
    }

    return features;
  }
}
