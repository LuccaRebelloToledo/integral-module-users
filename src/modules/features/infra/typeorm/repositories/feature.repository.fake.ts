import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import Feature from '../entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '@modules/features/dtos/find-features-by-key-or-name.dto';

export default class FakeFeatureRepository
  implements FeatureRepositoryInterface
{
  private features: Feature[] = [];

  public async findAll(): Promise<Feature[]> {
    return this.features;
  }

  public async findAllByUserId(userId: string): Promise<Feature[]> {
    return this.features.filter((feature) =>
      feature.userFeatures.some((user) => user.id === userId),
    );
  }

  public async findAllFeaturesByFeatureGroupId(
    featureGroupId: string,
  ): Promise<Feature[]> {
    return this.features.filter((feature) =>
      feature.featureGroups.some((group) => group.id === featureGroupId),
    );
  }

  public async findById(featureId: string): Promise<Feature | null> {
    const foundFeature = this.features.find(
      (feature) => feature.id === featureId,
    );

    return foundFeature || null;
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]> {
    const foundFeatures = this.features.filter(
      (feature) =>
        feature.key.includes(key ?? '') || feature.name.includes(name ?? ''),
    );

    return foundFeatures;
  }
}
