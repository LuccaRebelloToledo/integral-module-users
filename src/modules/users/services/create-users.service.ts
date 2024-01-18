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
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
    }

    const generatedNanoId = generateNanoId();
    const encryptedPassword = await this.bcryptHashProvider.generateHash(
      password,
    );

    const createdUser = await this.userRepository.create({
      id: generatedNanoId,
      name,
      email,
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
