import PaginationServiceResponseDTO from '@shared/dtos/pagination-service-response.dto';

import Feature from '../infra/typeorm/entities/feature.entity';

export default interface ListFeaturesServiceResponseDTO
  extends PaginationServiceResponseDTO<Feature> {}
