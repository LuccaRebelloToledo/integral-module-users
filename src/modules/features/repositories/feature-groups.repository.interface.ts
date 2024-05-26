import BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ListFeatureGroupsRepositoryParamsDto from '../dtos/list-feature-groups-repository-params.dto';
import ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import FindByKeyOrNameDto from '../dtos/find-by-key-or-name.dto';
import CreateFeatureGroupsDto from '../dtos/create-feature-groups.dto';

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
