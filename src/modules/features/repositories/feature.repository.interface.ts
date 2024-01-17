import Feature from '../infra/typeorm/entities/feature.entity';

import FindFeaturesByKeyOrNameDTO from '../dtos/find-features-by-key-or-name.dto';

export default interface FeatureRepositoryInterface {
  findAll(): Promise<Feature[]>;
  findAllByUserId(userId: string): Promise<Feature[]>;
  findById(featureId: string): Promise<Feature | null>;
  findByKeyOrName({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]>;
}
