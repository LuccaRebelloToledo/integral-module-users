import FeatureGroupRepositoryInterface from '@modules/features/repositories/feature-group.repository.interface';
import FeatureGroup from '../entities/feature-group.entity';

import FindFeatureGroupsByKeyOrNameDTO from '@modules/features/dtos/find-feature-groups-by-key-or-name.dto';
import CreateFeatureGroupsDTO from '@modules/features/dtos/create-feature-groups.dto';

export default class FakeFeatureGroupRepository
  implements FeatureGroupRepositoryInterface
{
  private featureGroups: FeatureGroup[] = [];

  public async findAll(): Promise<FeatureGroup[]> {
    return this.featureGroups;
  }

  public async findById(featureGroupId: string): Promise<FeatureGroup | null> {
    const foundFeatureGroup = this.featureGroups.find(
      (featureGroup) => featureGroup.id === featureGroupId,
    );

    return foundFeatureGroup || null;
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]> {
    const foundFeatureGroups = this.featureGroups.filter(
      (featureGroup) =>
        featureGroup.key.includes(key ?? '') ||
        featureGroup.name.includes(name ?? ''),
    );

    return foundFeatureGroups;
  }

  public async create(
    featureGroupData: CreateFeatureGroupsDTO,
  ): Promise<FeatureGroup> {
    const newFeatureGroup = new FeatureGroup();
    Object.assign(newFeatureGroup, {
      ...featureGroupData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.featureGroups.push(newFeatureGroup);

    return newFeatureGroup;
  }

  public async save(featureGroup: FeatureGroup): Promise<FeatureGroup> {
    const findIndex = this.featureGroups.findIndex(
      (findFeatureGroup) => findFeatureGroup.id === featureGroup.id,
    );

    featureGroup.updatedAt = new Date();

    this.featureGroups[findIndex] = featureGroup;

    return featureGroup;
  }

  public async delete(featureGroup: FeatureGroup): Promise<void> {
    const findIndex = this.featureGroups.findIndex(
      (findFeatureGroup) => findFeatureGroup.id === featureGroup.id,
    );

    this.featureGroups.splice(findIndex, 1);
  }
}
