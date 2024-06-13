import getActiveDataSource from '@shared/utils/get-active-data-source.util';

import { ILike, Repository } from 'typeorm';

import IFeatureGroupsRepository from '@modules/features/repositories/feature-groups.repository.interface';
import FeatureGroup from '../entities/feature-group.entity';

import ListFeatureGroupsRepositoryParamsDto from '@modules/features/dtos/list-feature-groups-repository-params.dto';
import ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import FindByKeyOrNameDto from '@modules/features/dtos/find-by-key-or-name.dto';
import CreateFeatureGroupsDto from '@modules/features/dtos/create-feature-groups.dto';

export default class FeatureGroupsRepository
  implements IFeatureGroupsRepository
{
  private readonly featureGroupsRepository: Repository<FeatureGroup>;

  constructor() {
    this.featureGroupsRepository =
      getActiveDataSource().getRepository(FeatureGroup);
  }

  public async findAll({
    take,
    skip,
    sort,
    order,
    key,
    name,
  }: ListFeatureGroupsRepositoryParamsDto): Promise<
    ListRepositoryResponseDto<FeatureGroup>
  > {
    const query = this.featureGroupsRepository
      .createQueryBuilder('feature_groups')
      .take(take)
      .skip(skip)
      .orderBy(`feature_groups.${sort}`, order as 'ASC' | 'DESC');

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

  public async findById(featureGroupId: string): Promise<FeatureGroup | null> {
    return await this.featureGroupsRepository.findOne({
      where: {
        id: featureGroupId,
      },
      relations: ['features'],
    });
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindByKeyOrNameDto): Promise<FeatureGroup | null> {
    const query =
      this.featureGroupsRepository.createQueryBuilder('feature_groups');

    if (key) {
      query.orWhere({ key: ILike(`%${key}%`) });
    }

    if (name) {
      query.orWhere({ name: ILike(`%${name}%`) });
    }

    return await query.getOne();
  }

  public async create(
    featureGroupDto: CreateFeatureGroupsDto,
  ): Promise<FeatureGroup> {
    const featureGroup = this.featureGroupsRepository.create(featureGroupDto);

    return await this.save(featureGroup);
  }

  public async save(featureGroup: FeatureGroup): Promise<FeatureGroup> {
    return await this.featureGroupsRepository.save(featureGroup);
  }

  public async delete(id: string): Promise<void> {
    await this.featureGroupsRepository.delete(id);
  }

  public async softDelete(id: string): Promise<void> {
    await this.featureGroupsRepository.softDelete(id);
  }
}
