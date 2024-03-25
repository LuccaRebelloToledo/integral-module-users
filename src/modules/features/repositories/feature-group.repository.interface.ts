import BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ListFeatureGroupsRepositoryParamsDTO from '../dtos/list-feature-groups-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import FindFeatureGroupsByKeyOrNameDTO from '../dtos/find-feature-groups-by-key-or-name.dto';
import CreateFeatureGroupsDTO from '../dtos/create-feature-groups.dto';

export default interface FeatureGroupRepositoryInterface
  extends BaseRepositoryInterface<FeatureGroup> {
  findAll(
    params: ListFeatureGroupsRepositoryParamsDTO,
  ): Promise<ListRepositoryResponseDTO<FeatureGroup>>;
  findByKeyOrName({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]>;
  create(featureGroupData: CreateFeatureGroupsDTO): Promise<FeatureGroup>;
}
