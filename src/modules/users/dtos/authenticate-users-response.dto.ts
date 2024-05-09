import User from '../infra/typeorm/entities/user.entity';

export default interface AuthenticateUsersResponseDTO {
  user: Partial<User>;
  token: string;
}
