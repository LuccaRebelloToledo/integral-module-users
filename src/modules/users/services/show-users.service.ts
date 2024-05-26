import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/users.repository.interface';
import User from '../infra/typeorm/entities/user.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ShowUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, NOT_FOUND);
    }

    return user;
  }
}
