import getActiveDataSource from '@shared/utils/get-active-data-source.util';

import { ILike, type Repository } from 'typeorm';

import type IUsersRepository from '@modules/users/repositories/users.repository.interface';
import User from '../entities/user.entity';

import type CreateUsersDto from '@modules/users/dtos/create-users.dto';
import type ListUsersRepositoryParamsDto from '@modules/users/dtos/list-users-repository-params.dto';
import type ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';

export default class UsersRepository implements IUsersRepository {
  private readonly usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getActiveDataSource().getRepository(User);
  }

  public async findAll({
    take,
    skip,
    sort,
    order,
    name,
    email,
  }: ListUsersRepositoryParamsDto): Promise<ListRepositoryResponseDto<User>> {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .take(take)
      .skip(skip)
      .orderBy(`users.${sort}`, order as 'ASC' | 'DESC');

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    if (email) {
      query.andWhere({ email: ILike(`%${email}%`) });
    }

    const [data, totalItems] = await query.getManyAndCount();

    return {
      data,
      totalItems,
    };
  }

  public async findById(id: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.featureGroup', 'featureGroup')
      .leftJoinAndSelect('featureGroup.features', 'features')
      .where({ id })
      .getOne();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.featureGroup', 'featureGroup')
      .leftJoinAndSelect('featureGroup.features', 'features')
      .where({ email })
      .getOne();
  }

  public async create(userData: CreateUsersDto): Promise<User> {
    const user = this.usersRepository.create(userData);

    return await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  public async softDelete(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
