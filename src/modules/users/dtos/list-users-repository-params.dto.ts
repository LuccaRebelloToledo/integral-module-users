import type ListRepositoryParamsDto from '@shared/dtos/list-repository-params.dto';
import type EmailAndNameOptionalDto from './email-and-name-optional.dto';

export default interface ListUsersRepositoryParamsDto
  extends ListRepositoryParamsDto,
    EmailAndNameOptionalDto {}
