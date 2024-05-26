import CreateUsersDTO from './create-users.dto';

export default interface UpdateUsersDto extends Partial<CreateUsersDTO> {
  id: string;
}
