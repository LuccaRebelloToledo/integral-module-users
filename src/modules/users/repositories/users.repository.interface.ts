import IBaseRepository from '@shared/infra/typeorm/repositories/base-repository.interface';

import User from '../infra/typeorm/entities/user.entity';

import ListUsersRepositoryParamsDTO from '../dtos/list-users-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import CreateUsersDTO from '../dtos/create-users.dto';

export default interface IUsersRepository extends IBaseRepository<User> {
  findAll(
    params: ListUsersRepositoryParamsDTO,
  ): Promise<ListRepositoryResponseDTO<User>>;
  findByEmail(email: string): Promise<User | null>;
  create(userDto: CreateUsersDTO): Promise<User>;
}
