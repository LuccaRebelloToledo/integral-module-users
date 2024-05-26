import ListServiceParamsDto from '@shared/dtos/list-service-params.dto';
import EmailAndNameOptionalDto from './email-and-name-optional.dto';

export default interface ListUsersServiceParamsDto
  extends ListServiceParamsDto,
    EmailAndNameOptionalDto {}
