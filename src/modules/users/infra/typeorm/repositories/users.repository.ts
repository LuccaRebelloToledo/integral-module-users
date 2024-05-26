import getActiveDataSource from '@shared/utils/get-active-data-source.utils';

import { ILike, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/users.repository.interface';
import User from '../entities/user.entity';

import ListUsersRepositoryParamsDto from '@modules/users/dtos/list-users-repository-params.dto';
import ListRepositoryResponseDto from '@shared/dtos/list-repository-response.dto';
import CreateUsersDto from '@modules/users/dtos/create-users.dto';

export default class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>;

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
      .leftJoinAndSelect('users.featureGroup', 'featureGroup')
      .take(take)
      .skip(skip)
      .orderBy(`users.${sort}`, order as 'ASC' | 'DESC');

    if (name) {
      query.andWhere({ name: ILike(`%${name}%`) });
    }

    if (email) {
      query.andWhere({ email: ILike(`%${email}%`) });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
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
      .addSelect('users.password')
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
