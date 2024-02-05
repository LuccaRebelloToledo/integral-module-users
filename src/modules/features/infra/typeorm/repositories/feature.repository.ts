import {
  AppDataSource,
  TestAppDataSource,
  isTesting,
} from '@shared/infra/http/data-source';

import { ILike, Repository } from 'typeorm';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';
import CreateFeaturesDTO from '@modules/features/dtos/create-features.dto';

export default class FeatureRepository implements FeatureRepositoryInterface {
  private featureRepository: Repository<Feature>;

  constructor() {
    this.featureRepository = isTesting
      ? TestAppDataSource.getRepository(Feature)
      : AppDataSource.getRepository(Feature);
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
    const query = this.featureRepository.createQueryBuilder('features');

    if (key) {
      query.where({ key: ILike(`%${key}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    return await query.getMany();
  }

  public async create(featureData: CreateFeaturesDTO): Promise<Feature> {
    const feature = this.featureRepository.create(featureData);

    return this.save(feature);
  }
  public async save(feature: Feature): Promise<Feature> {
    return this.featureRepository.save(feature);
  }
}
