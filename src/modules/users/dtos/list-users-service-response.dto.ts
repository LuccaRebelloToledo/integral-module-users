import PaginationServiceResponseDTO from '@shared/dtos/pagination-service-response.dto';
import User from '../infra/typeorm/entities/user.entity';

export default interface ListUsersServiceResponseDTO
  extends PaginationServiceResponseDTO<User> {}
