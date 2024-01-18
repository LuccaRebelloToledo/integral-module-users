import { inject, injectable } from 'tsyringe';

import ListUsersDTO from '../dtos/list-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';

import generateNanoId from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

interface CreateUsersServiceDTO {
  email: string;
  password: string;
  name: string;
  featureGroupId?: string;
}

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    name,
    email,
    password,
    featureGroupId = 'FWwq9ec55ZQUYpIKsCBUk',
  }: CreateUsersServiceDTO): Promise<ListUsersDTO> {
    const emailInput = email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(emailInput);

    if (user) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
    }

    const generatedNanoId = generateNanoId();
    const nameInput = name.trim();

    const passwordInput = password.trim();
    const encryptedPassword = await this.bcryptHashProvider.generateHash(
      passwordInput,
    );

    const createdUser = await this.userRepository.create({
      id: generatedNanoId,
      name: nameInput,
      email: emailInput,
      password: encryptedPassword,
      featureGroupId,
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
  }
}
