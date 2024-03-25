import BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesRepositoryParamsDTO from '../dtos/list-features-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import FindFeaturesByKeyOrNameDTO from '../dtos/find-features-by-key-or-name.dto';
import CreateFeaturesDTO from '../dtos/create-features.dto';

export default interface FeatureRepositoryInterface
  extends BaseRepositoryInterface<Feature> {
  findAll(
    params: ListFeaturesRepositoryParamsDTO,
  ): Promise<ListRepositoryResponseDTO<Feature>>;
  findAllByUserId(userId: string): Promise<Feature[]>;
  findAllFeaturesByFeatureGroupId(featureGroupId: string): Promise<Feature[]>;
  findByKeyOrName({
    key,
    name,
  }: FindFeaturesByKeyOrNameDTO): Promise<Feature[]>;
  create(featureData: CreateFeaturesDTO): Promise<Feature>;
}
