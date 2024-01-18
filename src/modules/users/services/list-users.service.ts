import { inject, injectable } from 'tsyringe';

import ListUsersDTO from '../dtos/list-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<ListUsersDTO> {
    const userIdInput = userId.trim();

    const user = await this.userRepository.findById(userIdInput);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
