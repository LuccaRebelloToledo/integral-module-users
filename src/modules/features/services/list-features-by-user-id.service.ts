import { inject, injectable } from 'tsyringe';

import FeaturesRepositoryInterface from '../repositories/features.repository.interface';

import Feature from '../infra/typeorm/entities/feature.entity';

@injectable()
export default class ListFeaturesByUserIdService {
  constructor(
    @inject('FeaturesRepository')
    private featuresRepository: FeaturesRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<Feature[]> {
    const features = await this.featuresRepository.findAllByUserId(userId);

    return features;
  }
}
