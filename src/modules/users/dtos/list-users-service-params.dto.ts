import PaginationServiceParamsDTO from '@shared/dtos/pagination-service-params.dto';
import EmailAndNameOptionalDTO from './email-and-name-optional.dto';

export default interface ListUsersServiceParamsDTO
  extends PaginationServiceParamsDTO,
    EmailAndNameOptionalDTO {}
