import { inject, injectable } from 'tsyringe';

import ListUsersDTO from '../dtos/list-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class ShowUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(): Promise<ListUsersDTO[]> {
    const users = await this.userRepository.findAll();

    if (!users.length) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
