import { getActiveDataSource } from '@shared/utils/get-active-data-source.utils';

import { ILike, Repository } from 'typeorm';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import ListFeaturesRepositoryParamsDTO from '@modules/features/dtos/list-features-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';
import CreateFeaturesDTO from '@modules/features/dtos/create-features.dto';

export default class FeatureRepository implements FeatureRepositoryInterface {
  private featureRepository: Repository<Feature>;

  constructor() {
    this.featureRepository = getActiveDataSource().getRepository(Feature);
  }

  public async findAll({
    take,
    skip,
    sort,
    order,
    key,
    name,
  }: ListFeaturesRepositoryParamsDTO): Promise<
    ListRepositoryResponseDTO<Feature>
  > {
    const query = this.featureRepository
      .createQueryBuilder('features')
      .take(take)
      .skip(skip)
      .orderBy(`features.${sort}`, order as 'ASC' | 'DESC');

    if (key) {
      query.andWhere({ key: ILike(`%${key}%`) });
    }

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
    };
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
      query.orWhere({ key: ILike(`%${key}%`) });
    }

    if (name) {
      query.orWhere({ name: ILike(`%${name}%`) });
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
