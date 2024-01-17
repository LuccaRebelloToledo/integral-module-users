import { AppDataSource } from '@shared/infra/http/data-source';

import { Repository } from 'typeorm';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';

export default class FeatureRepository implements FeatureRepositoryInterface {
  private featureRepository: Repository<Feature>;

  constructor() {
    this.featureRepository = AppDataSource.getRepository(Feature);
  }

  public async findAll(): Promise<Feature[]> {
    return await this.featureRepository.find();
  }

  public async findAllByUserId(userId: string): Promise<Feature[]> {
    return await this.featureRepository
      .createQueryBuilder('feature')
      .innerJoinAndSelect('feature.userFeatures', 'user', 'user.id = :userId', {
        userId,
      })
      .getMany();
  }

  public async findById(featureId: string): Promise<Feature | null> {
    return await this.featureRepository.findOne({
      where: {
        id: featureId,
      },
    });
  }

  public async findByOrKeyOrName({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]> {
    return await this.featureRepository.find({
      where: [{ key }, { name }],
    });
  }
}
