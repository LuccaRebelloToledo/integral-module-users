import { getActiveDataSource } from '@shared/utils/get-active-data-source.utils';

import { ILike, Repository } from 'typeorm';

import UsersRepositoryInterface from '@modules/users/repositories/users.repository.interface';
import User from '../entities/user.entity';

import ListUsersRepositoryParamsDTO from '@modules/users/dtos/list-users-repository-params.dto';
import ListRepositoryResponseDTO from '@shared/dtos/list-repository-response.dto';
import CreateUsersDTO from '@modules/users/dtos/create-users.dto';

export default class UsersRepository implements UsersRepositoryInterface {
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
  }: ListUsersRepositoryParamsDTO): Promise<ListRepositoryResponseDTO<User>> {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.featureGroup', 'featureGroup')
      .leftJoinAndSelect('users.standaloneFeatures', 'standaloneFeatures')
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
    return await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['featureGroup', 'standaloneFeatures'],
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
      select: [
        'id',
        'name',
        'email',
        'password',
        'featureGroupId',
        'featureGroup',
        'standaloneFeatures',
      ],
      relations: ['featureGroup', 'standaloneFeatures'],
    });
  }

  public async create(userData: CreateUsersDTO): Promise<User> {
    const user = this.usersRepository.create(userData);

    return await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public async delete(user: User): Promise<void> {
    await this.usersRepository.delete(user.id);
  }

  public async softDelete(user: User): Promise<void> {
    await this.usersRepository.softDelete(user.id);
  }
}
