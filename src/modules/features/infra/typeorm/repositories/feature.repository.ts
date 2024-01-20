import { AppDataSource } from '@shared/infra/http/data-source';

import { Like, Repository } from 'typeorm';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';

export default class FeatureRepository implements FeatureRepositoryInterface {
  private featureRepository: Repository<Feature>;

  constructor() {
    this.featureRepository = AppDataSource.getRepository(Feature);
  }

  public async findAll(): Promise<Feature[]> {
    return await this.featureRepository.find({
      select: {
        id: true,
        key: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public async findAllByUserId(userId: string): Promise<Feature[]> {
    return await this.featureRepository
      .createQueryBuilder('features')
      .select([
        'features.id',
        'features.key',
        'features.name',
        'features.createdAt',
        'features.updatedAt',
      ])
      .innerJoin('features.userFeatures', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  public async findAllFeaturesByFeatureGroupId(
    featureGroupId: string,
  ): Promise<Feature[]> {
    return await this.featureRepository
      .createQueryBuilder('features')
      .select([
        'features.id',
        'features.key',
        'features.name',
        'features.createdAt',
        'features.updatedAt',
      ])
      .innerJoin('grouped_features', 'gf', 'features.id = gf.featureId')
      .where('gf.featureGroupId = :featureGroupId', { featureGroupId })
      .getMany();
  }

  public async findById(featureId: string): Promise<Feature | null> {
    return await this.featureRepository.findOne({
      where: {
        id: featureId,
      },
    });
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]> {
    return await this.featureRepository.find({
      where: [{ key: Like(`%${key}%`) }, { name: Like(`%${name}%`) }],
    });
  }
}
