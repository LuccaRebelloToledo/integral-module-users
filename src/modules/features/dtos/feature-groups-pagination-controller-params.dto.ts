import PaginationControllerParamsDTO from '@shared/dtos/pagination-controller-params.dto';
import ListByKeyOrNameQueryDTO from '@shared/dtos/list-by-key-or-name-query.dto';

export default interface FeatureGroupPaginationControllerParamsDTO
  extends PaginationControllerParamsDTO,
    ListByKeyOrNameQueryDTO {}
