import { inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class DeleteUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    await this.userRepository.delete(user);
  }
}
