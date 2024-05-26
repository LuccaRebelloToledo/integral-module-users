import ListRepositoryParamsDto from '@shared/dtos/list-repository-params.dto';
import EmailAndNameOptionalDto from './email-and-name-optional.dto';

export default interface ListUsersRepositoryParamsDto
  extends ListRepositoryParamsDto,
    EmailAndNameOptionalDto {}
