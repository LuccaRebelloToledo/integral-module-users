import getActiveDataSource from '@shared/utils/get-active-data-source.util';

import { ILike, Repository } from 'typeorm';

import IFeaturesRepository from '@modules/features/repositories/features.repository.interface';
import Feature from '../entities/feature.entity';

import ListFeaturesRepositoryParamsDto from '@modules/features/dtos/list-features-repository-params.dto';
import ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import CreateFeaturesDto from '@modules/features/dtos/create-features.dto';

export default class FeaturesRepository implements IFeaturesRepository {
  private readonly featuresRepository: Repository<Feature>;

  constructor() {
    this.featuresRepository = getActiveDataSource().getRepository(Feature);
  }

  public async findAll({
    take,
    skip,
    sort,
    order,
    key,
    name,
  }: ListFeaturesRepositoryParamsDto): Promise<
    ListRepositoryResponseDto<Feature>
  > {
    const query = this.featuresRepository
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

    const [data, totalItems] = await query.getManyAndCount();

    return {
      data,
      totalItems,
    };
  }

  public async findById(featureId: string): Promise<Feature | null> {
    return await this.featuresRepository.findOne({
      where: {
        id: featureId,
      },
    });
  }

  public async create(featureDto: CreateFeaturesDto): Promise<Feature> {
    const feature = this.featuresRepository.create(featureDto);

    return await this.save(feature);
  }

  public async save(feature: Feature): Promise<Feature> {
    return await this.featuresRepository.save(feature);
  }

  public async delete(id: string): Promise<void> {
    await this.featuresRepository.delete(id);
  }

  public async softDelete(id: string): Promise<void> {
    await this.featuresRepository.softDelete(id);
  }
}
