import ListControllerParamsDto from '@shared/dtos/list-controller-params.dto';
import EmailAndNameOptionalDto from './email-and-name-optional.dto';

export default interface ListUsersControllerParamsDto
  extends ListControllerParamsDto,
    EmailAndNameOptionalDto {}
