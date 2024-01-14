import { AppDataSource } from '@shared/infra/http/data-source';

import { Repository } from 'typeorm';

import UserRepositoryInterface from '@modules/users/repositories/user.repository.interface';
import User from '../entities/user.entity';

import CreateUsersDTO from '@modules/users/dtos/create-users.dto';

export default class UserRepository implements UserRepositoryInterface {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  public async create(userData: CreateUsersDTO): Promise<User> {
    const user = this.userRepository.create(userData);

    return await this.save(user);
  }

  public async save(userData: User): Promise<User> {
    return await this.userRepository.save(userData);
  }

  public async delete(userData: User): Promise<void> {
    await this.userRepository.delete(userData.id);
  }
}
