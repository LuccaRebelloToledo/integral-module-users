import type CreateUsersDto from './create-users.dto';

export default interface UpdateUsersDto extends Partial<CreateUsersDto> {
  id: string;
}
