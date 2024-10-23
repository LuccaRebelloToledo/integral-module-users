import type ListControllerParamsDto from '@shared/dtos/list-controller-params.dto';
import type EmailAndNameOptionalDto from './email-and-name-optional.dto';

export default interface ListUsersControllerParamsDto
  extends ListControllerParamsDto,
    EmailAndNameOptionalDto {}
