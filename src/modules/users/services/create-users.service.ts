import { container, inject, injectable } from 'tsyringe';

import type CreateUsersServiceDTO from '../dtos/create-users-service.dto';

import type User from '../infra/typeorm/entities/user.entity';
import type IHashProvider from '../providers/hash-provider/models/hash.provider.interface';
import type IUsersRepository from '../repositories/users.repository.interface';

import ShowFeatureGroupsByKeyOrNameService from '@modules/features/services/show-feature-groups-by-key-or-name.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUsersServiceDTO): Promise<User> {
    const existingUserByEmail = await this.usersRepository.findByEmail(email);

    if (existingUserByEmail) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse, CONFLICT);
    }

    const showFeatureGroupsByKeyOrNameService = container.resolve(
      ShowFeatureGroupsByKeyOrNameService,
    );

    const featureGroup = await showFeatureGroupsByKeyOrNameService.execute({
      key: 'ADMIN',
    });

    const encryptedPassword = await this.hashProvider.generateHash(password);

    return await this.usersRepository.create({
      name,
      email,
      password: encryptedPassword,
      featureGroupId: featureGroup.id,
    });
  }
}
