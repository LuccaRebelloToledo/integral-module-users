import { container, inject, injectable } from 'tsyringe';

import type User from '../infra/typeorm/entities/user.entity';
import type IHashProvider from '../providers/hash-provider/models/hash.provider.interface';
import type IUsersRepository from '../repositories/users.repository.interface';

import type UpdateUsersDTO from '../dtos/update-users.dto';

import getUserById from '../utils/get-user-by-id.util';

import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
    featureGroupId,
  }: UpdateUsersDTO): Promise<User> {
    const user = await getUserById(id);

    if (name) {
      this.updateName(user, name);
    }

    if (email) {
      await this.updateEmail(user, email);
    }

    if (featureGroupId) {
      await this.updateFeatureGroup(user, featureGroupId);
    }

    if (password) {
      await this.updatePassword(user, password);
    }

    return await this.usersRepository.save(user);
  }

  private async updateEmail(user: User, email: string) {
    const existingUserByEmail = await this.usersRepository.findByEmail(email);

    if (existingUserByEmail) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse, CONFLICT);
    }

    user.email = email;
  }

  private async updateFeatureGroup(user: User, featureGroupId: string) {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    const featureGroup = await showFeatureGroupsService.execute(featureGroupId);

    user.featureGroupId = featureGroup.id;
  }

  private updateName(user: User, name: string) {
    if (user.name !== name) {
      user.name = name;
    }
  }

  private async updatePassword(user: User, password: string) {
    const encryptedPassword = await this.hashProvider.generateHash(password);

    user.password = encryptedPassword;
  }
}
