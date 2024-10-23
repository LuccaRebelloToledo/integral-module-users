import type CreateUsersServiceDto from './create-users-service.dto';

export default interface CreateUsersDTO extends CreateUsersServiceDto {
  featureGroupId: string;
}
