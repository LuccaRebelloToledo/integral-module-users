import getActiveDataSource from '@shared/utils/get-active-data-source.util';

import type { Repository } from 'typeorm';

import type IUserTokensRepository from '@modules/users/repositories/user-tokens.repository.interface';

import type CreateUserTokensDto from '@modules/users/dtos/create-user-tokens.dto';
import UserToken from '../entities/user-token.entity';

export default class UserTokensRepository implements IUserTokensRepository {
  private readonly userTokensRepository: Repository<UserToken>;

  constructor() {
    this.userTokensRepository = getActiveDataSource().getRepository(UserToken);
  }

  public async findAllByUserId(userId: string): Promise<UserToken[]> {
    return await this.userTokensRepository.find({
      where: { userId },
    });
  }

  public async create(userTokensData: CreateUserTokensDto): Promise<UserToken> {
    const userToken = this.userTokensRepository.create(userTokensData);

    return await this.save(userToken);
  }

  public async save(userToken: UserToken): Promise<UserToken> {
    return await this.userTokensRepository.save(userToken);
  }

  public async delete(id: string): Promise<void> {
    await this.userTokensRepository.delete(id);
  }
}
