import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import FindFeatureGroupsByKeyOrNameDTO from '../dtos/find-feature-groups-by-key-or-name.dto';
import CreateFeatureGroupsDTO from '../dtos/create-feature-groups.dto';

export default interface FeatureGroupRepositoryInterface {
  findAll(): Promise<FeatureGroup[]>;
  findById(featureGroupId: string): Promise<FeatureGroup | null>;
  findByKeyOrName({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]>;
  create(featureGroupData: CreateFeatureGroupsDTO): Promise<FeatureGroup>;
  save(featureGroup: FeatureGroup): Promise<FeatureGroup>;
  delete(featureGroup: FeatureGroup): Promise<void>;
}
