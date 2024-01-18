import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import Feature from '../infra/typeorm/entities/feature.entity';

@injectable()
export default class ShowFeaturesByUserIdService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<Feature[]> {
    const features = await this.featureRepository.findAllByUserId(userId);

    return features;
  }
}
