import type ListServiceParamsDto from '@shared/dtos/list-service-params.dto';
import type FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeatureGroupsServiceParamsDto
  extends ListServiceParamsDto,
    FindByKeyOrNameDto {}
