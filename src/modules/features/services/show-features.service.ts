import { inject, injectable } from 'tsyringe';

import type Feature from '../infra/typeorm/entities/feature.entity';
import type IFeaturesRepository from '../repositories/features.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ShowFeaturesService {
  constructor(
    @inject('FeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  public async execute(featureId: string): Promise<Feature> {
    const feature = await this.featuresRepository.findById(featureId);

    if (!feature) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
    }

    return feature;
  }
}
