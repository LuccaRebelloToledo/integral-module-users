import ListRepositoryParamsDTO from '@shared/dtos/list-repository-params.dto';
import EmailAndNameOptionalDTO from './email-and-name-optional.dto';

export default interface ListUsersRepositoryParamsDTO
  extends ListRepositoryParamsDTO,
    EmailAndNameOptionalDTO {}
