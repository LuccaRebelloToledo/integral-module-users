import { TestDataSource } from '@shared/infra/http/test-data-source';

import { Repository } from 'typeorm';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';

interface CreateFeatureDTO {
  id: string;
  name: string;
  key: string;
}

export default class FakeFeatureRepository
  implements FeatureRepositoryInterface
{
  private featureRepository: Repository<Feature>;

  constructor() {
    this.featureRepository = TestDataSource.getRepository(Feature);
  }

  public async findAll(): Promise<Feature[]> {
    return await this.featureRepository.find();
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
    let query = this.featureRepository.createQueryBuilder('features');

    if (key) {
      query = query.where('LOWER(features.key) LIKE :key', {
        key: `%${key.toLowerCase()}%`,
      });
    }

    if (name) {
      query = query.orWhere('LOWER(features.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    return await query.getMany();
  }

  public async create(featureData: CreateFeatureDTO): Promise<Feature> {
    const feature = this.featureRepository.create(featureData);

    return await this.save(feature);
  }

  public async save(feature: Feature): Promise<Feature> {
    return await this.featureRepository.save(feature);
  }
}
