import BaseRepositoryInterface from '@shared/infra/typeorm/repositories/base-repository.interface';

import User from '../infra/typeorm/entities/user.entity';

import ListUsersRepositoryParamsDTO from '../dtos/list-users-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import CreateUsersDTO from '../dtos/create-users.dto';

export default interface UserRepositoryInterface
  extends BaseRepositoryInterface<User> {
  findAll(
    params: ListUsersRepositoryParamsDTO,
  ): Promise<ListRepositoryResponseDTO<User>>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUsersDTO): Promise<User>;
}
