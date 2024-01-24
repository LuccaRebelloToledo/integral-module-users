import { inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import User from '../infra/typeorm/entities/user.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    if (!!users.length) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    return users;
  }
}
