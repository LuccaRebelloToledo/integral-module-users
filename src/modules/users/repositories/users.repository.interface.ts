import type IBaseRepository from '@shared/infra/typeorm/repositories/base-repository.interface';

import type User from '../infra/typeorm/entities/user.entity';

import type ListUsersRepositoryParamsDTO from '../dtos/list-users-repository-params.dto';
import type ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import type CreateUsersDTO from '../dtos/create-users.dto';

export default interface IUsersRepository extends IBaseRepository<User> {
  findAll(
    params: ListUsersRepositoryParamsDTO,
  ): Promise<ListRepositoryResponseDTO<User>>;
  findByEmail(email: string): Promise<User | null>;
  create(userDto: CreateUsersDTO): Promise<User>;
}
