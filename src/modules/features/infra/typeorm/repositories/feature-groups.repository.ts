import { getActiveDataSource } from '@shared/utils/get-active-data-source.utils';

import { ILike, Repository } from 'typeorm';

import FeatureGroupsRepositoryInterface from '@modules/features/repositories/feature-groups.repository.interface';
import FeatureGroup from '../entities/feature-group.entity';

import ListFeatureGroupsRepositoryParamsDTO from '@modules/features/dtos/list-feature-groups-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import FindFeatureGroupsByKeyOrNameDTO from '@modules/features/dtos/find-feature-groups-by-key-or-name.dto';
import CreateFeatureGroupsDTO from '@modules/features/dtos/create-feature-groups.dto';

export default class FeatureGroupsRepository
  implements FeatureGroupsRepositoryInterface
{
  private featureGroupsRepository: Repository<FeatureGroup>;

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
  }: ListFeatureGroupsRepositoryParamsDTO): Promise<
    ListRepositoryResponseDTO<FeatureGroup>
  > {
    const query = this.featureGroupsRepository
      .createQueryBuilder('feature_groups')
      .leftJoinAndSelect('feature_groups.features', 'features')
      .take(take)
      .skip(skip)
      .orderBy(`feature_groups.${sort}`, order as 'ASC' | 'DESC');

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

  public async findById(featureGroupId: string): Promise<FeatureGroup | null> {
    return await this.featureGroupsRepository.findOne({
      where: {
        id: featureGroupId,
      },
    });
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]> {
    const query =
      this.featureGroupsRepository.createQueryBuilder('feature_groups');

    if (key) {
      query.orWhere({ key: ILike(`%${key}%`) });
    }

    if (name) {
      query.orWhere({ name: ILike(`%${name}%`) });
    }

    return await query.getMany();
  }

  public async create(
    featureGroupData: CreateFeatureGroupsDTO,
  ): Promise<FeatureGroup> {
    const featureGroup = this.featureGroupsRepository.create(featureGroupData);

    return await this.save(featureGroup);
  }

  public async save(featureGroup: FeatureGroup): Promise<FeatureGroup> {
    return await this.featureGroupsRepository.save(featureGroup);
  }

  public async delete(featureGroup: FeatureGroup): Promise<void> {
    await this.featureGroupsRepository.delete(featureGroup.id);
  }

  public async softDelete(featureGroup: FeatureGroup): Promise<void> {
    await this.featureGroupsRepository.softDelete(featureGroup.id);
  }
}
