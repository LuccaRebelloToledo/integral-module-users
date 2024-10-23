import type ListRepositoryParamsDto from '@shared/dtos/list-repository-params.dto';
import type FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeatureGroupsRepositoryParamsDto
  extends ListRepositoryParamsDto,
    FindByKeyOrNameDto {}
