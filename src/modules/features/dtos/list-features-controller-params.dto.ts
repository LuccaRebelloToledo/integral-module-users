import type ListControllerParamsDto from '@shared/dtos/list-controller-params.dto';
import type FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeaturesControllerParamsDto
  extends ListControllerParamsDto,
    FindByKeyOrNameDto {}
