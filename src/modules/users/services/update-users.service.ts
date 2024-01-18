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
    const userIdInput = String(id).trim();

    const user = await this.userRepository.findById(userIdInput);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    if (name) {
      const nameInput = String(name).trim();

      if (user.name !== nameInput) {
        user.name = nameInput;
      }
    }

    if (email) {
      const emailInput = String(email).trim().toLocaleLowerCase();

      const userWithEmail = await this.userRepository.findByEmail(emailInput);

      if (userWithEmail) {
        throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
      }

      user.email = emailInput;
    }

    if (password) {
      const passwordInput = String(password).trim();

      const encryptedPassword = await this.bcryptHashProvider.generateHash(
        passwordInput,
      );

      user.password = encryptedPassword;
    }

    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
  }
}
