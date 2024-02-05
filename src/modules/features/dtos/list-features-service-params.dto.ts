import ListByKeyOrNameQueryDTO from '@shared/dtos/list-by-key-or-name-query.dto';
import PaginationServiceParamsDTO from '@shared/dtos/pagination-service-params.dto';

export default interface ListFeaturesServiceParamsDTO
  extends PaginationServiceParamsDTO,
    ListByKeyOrNameQueryDTO {}
