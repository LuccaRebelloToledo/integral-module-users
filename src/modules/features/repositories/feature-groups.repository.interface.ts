import type BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import type ListFeatureGroupsRepositoryParamsDto from '../dtos/list-feature-groups-repository-params.dto';
import type ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import type FindByKeyOrNameDto from '../dtos/find-by-key-or-name.dto';
import type CreateFeatureGroupsDto from '../dtos/create-feature-groups.dto';

export default interface IFeatureGroupsRepository
  extends BaseRepositoryInterface<FeatureGroup> {
  findAll(
    params: ListFeatureGroupsRepositoryParamsDto,
  ): Promise<ListRepositoryResponseDto<FeatureGroup>>;
  findByKeyOrName({
    key,
    name,
  }: FindByKeyOrNameDto): Promise<FeatureGroup | null>;
  create(featureGroupDto: CreateFeatureGroupsDto): Promise<FeatureGroup>;
}
