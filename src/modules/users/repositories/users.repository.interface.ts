import type IBaseRepository from '@shared/infra/typeorm/repositories/base-repository.interface';

import type User from '../infra/typeorm/entities/user.entity';

import type ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import type CreateUsersDto from '../dtos/create-users.dto';
import type ListUsersRepositoryParamsDto from '../dtos/list-users-repository-params.dto';

export default interface IUsersRepository extends IBaseRepository<User> {
  findAll(
    params: ListUsersRepositoryParamsDto,
  ): Promise<ListRepositoryResponseDto<User>>;
  findByEmail(email: string): Promise<User | null>;
  create(userDto: CreateUsersDto): Promise<User>;
}
