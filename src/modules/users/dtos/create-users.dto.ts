import type CreateUsersServiceDto from './create-users-service.dto';

export default interface CreateUsersDto extends CreateUsersServiceDto {
  featureGroupId: string;
}
