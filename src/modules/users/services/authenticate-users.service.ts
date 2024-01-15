import { inject, injectable } from 'tsyringe';

import AuthenticateUsersDTO from '../dtos/authenticate-users.dto';

import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import ListUsersDTO from '../dtos/list-users.dto';

@injectable()
export default class AuthenticateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}
  public async execute({
    email,
    password,
  }: AuthenticateUsersDTO): Promise<ListUsersDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    const passwordMatch = await this.bcryptHashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
