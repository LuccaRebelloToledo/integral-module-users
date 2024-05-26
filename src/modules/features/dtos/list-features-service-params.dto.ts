import ListServiceParamsDto from '@shared/dtos/list-service-params.dto';
import FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeaturesServiceParamsDto
  extends ListServiceParamsDto,
    FindByKeyOrNameDto {}
