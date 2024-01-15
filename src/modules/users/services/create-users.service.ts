import { inject, injectable } from 'tsyringe';

import CreateUsersDTO from '../dtos/create-users.dto';
import ListUsersDTO from '../dtos/list-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';

import generateNanoId from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    id = generateNanoId(),
    name,
    email,
    password,
  }: CreateUsersDTO): Promise<ListUsersDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError('400', AppErrorTypes.users.emailAlreadyInUse);
    }

    const createdUser = await this.userRepository.create({
      id,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: await this.bcryptHashProvider.generateHash(password),
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }
}
