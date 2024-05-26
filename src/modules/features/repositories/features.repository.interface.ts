import BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesRepositoryParamsDto from '../dtos/list-features-repository-params.dto';
import ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import CreateFeaturesDTO from '../dtos/create-features.dto';

export default interface IFeaturesRepository
  extends BaseRepositoryInterface<Feature> {
  findAll(
    params: ListFeaturesRepositoryParamsDto,
  ): Promise<ListRepositoryResponseDto<Feature>>;
  create(featureDto: CreateFeaturesDTO): Promise<Feature>;
}
