import { inject, injectable } from 'tsyringe';

import FeaturesRepositoryInterface from '../repositories/features.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import Feature from '../infra/typeorm/entities/feature.entity';

@injectable()
export default class ListFeaturesByFeatureGroupIdService {
  constructor(
    @inject('FeaturesRepository')
    private featuresRepository: FeaturesRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<Feature[]> {
    const features =
      await this.featuresRepository.findAllFeaturesByFeatureGroupId(
        featureGroupId,
      );

    if (!features.length) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
    }

    return features;
  }
}
