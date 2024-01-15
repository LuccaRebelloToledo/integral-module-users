import { inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import ListUsersDTO from '../dtos/list-users.dto';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(): Promise<ListUsersDTO[]> {
    const users = await this.userRepository.findAll();

    if (!users || users.length === 0) {
      throw new AppError('404', AppErrorTypes.users.notFound);
    }

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
