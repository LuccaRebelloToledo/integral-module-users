import PaginationControllerParamsDTO from '@shared/dtos/pagination-controller-params.dto';
import EmailAndNameOptionalDTO from './email-and-name-optional.dto';

export default interface UserPaginationControllerParamsDTO
  extends PaginationControllerParamsDTO,
    EmailAndNameOptionalDTO {}
