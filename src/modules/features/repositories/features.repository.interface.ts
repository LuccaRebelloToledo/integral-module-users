import type BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import type Feature from '../infra/typeorm/entities/feature.entity';

import type ListFeaturesRepositoryParamsDto from '../dtos/list-features-repository-params.dto';
import type ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import type CreateFeaturesDTO from '../dtos/create-features.dto';

export default interface IFeaturesRepository
  extends BaseRepositoryInterface<Feature> {
  findAll(
    params: ListFeaturesRepositoryParamsDto,
  ): Promise<ListRepositoryResponseDto<Feature>>;
  create(featureDto: CreateFeaturesDTO): Promise<Feature>;
}
