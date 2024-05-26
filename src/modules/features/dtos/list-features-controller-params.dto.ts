import ListControllerParamsDto from '@shared/dtos/list-controller-params.dto';
import FindByKeyOrNameDto from './find-by-key-or-name.dto';

export default interface ListFeaturesControllerParamsDto
  extends ListControllerParamsDto,
    FindByKeyOrNameDto {}
