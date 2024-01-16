import { inject, injectable } from 'tsyringe';

import UpdateUsersDTO from '../dtos/update-users.dto';
import ListUsersDTO from '../dtos/list-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class UpdateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
  }: UpdateUsersDTO): Promise<ListUsersDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    if (name) {
      if (user.name !== name.trim()) {
        user.name = name.trim();
      }
    }

    if (email) {
      const userWithEmail = await this.userRepository.findByEmail(email);

      if (userWithEmail) {
        throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
      }

      user.email = email.toLocaleLowerCase().trim();
    }

    if (password) {
      user.password = await this.bcryptHashProvider.generateHash(password);
    }

    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
  }
}
