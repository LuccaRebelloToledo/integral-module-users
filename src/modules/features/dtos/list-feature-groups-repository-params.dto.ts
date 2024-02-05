import ListByKeyOrNameQueryDTO from '@shared/dtos/list-by-key-or-name-query.dto';
import ListRepositoryParamsDTO from '@shared/dtos/list-repository-params.dto';

export default interface ListFeatureGroupsRepositoryParamsDTO
  extends ListRepositoryParamsDTO,
    ListByKeyOrNameQueryDTO {}
