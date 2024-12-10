import type UserToken from '../infra/typeorm/entities/user-token.entity';

import type CreateUserTokensDto from '../dtos/create-user-tokens.dto';

export default interface IUserTokensRepository {
  findAllByUserId(userId: string): Promise<UserToken[]>;
  create(userTokensData: CreateUserTokensDto): Promise<UserToken>;
  save(userToken: UserToken): Promise<UserToken>;
  delete(id: string): Promise<void>;
}
