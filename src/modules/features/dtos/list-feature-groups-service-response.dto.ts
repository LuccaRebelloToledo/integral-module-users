import PaginationServiceResponseDTO from '@shared/dtos/pagination-service-response.dto';

import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

export default interface ListFeatureGroupsServiceResponseDTO
  extends PaginationServiceResponseDTO<FeatureGroup> {}
