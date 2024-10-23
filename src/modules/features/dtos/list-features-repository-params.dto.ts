import type ListRepositoryParamsDto from '@shared/dtos/list-repository-params.dto';
import type FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeaturesRepositoryParamsDto
  extends ListRepositoryParamsDto,
    FindByKeyOrNameDto {}
