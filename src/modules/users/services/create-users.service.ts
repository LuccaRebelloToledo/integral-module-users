import { container, inject, injectable } from 'tsyringe';

import CreateUsersServiceDTO from '../dtos/create-users-service.dto';

import UsersRepositoryInterface from '../repositories/users.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import User from '../infra/typeorm/entities/user.entity';

import { generateNanoId } from '@shared/utils/generate-nanoid.utils';

import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';
import ListFeatureGroupsByKeyOrNameService from '@modules/features/services/list-feature-groups-by-key-or-name.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    name,
    email,
    password,
    featureGroupId,
  }: CreateUsersServiceDTO): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse, CONFLICT);
    }

    if (featureGroupId) {
      await this.verifyFeatureGroup(featureGroupId);
    }

    if (!featureGroupId) {
      const listFeatureGroupsByKeyOrNameService = container.resolve(
        ListFeatureGroupsByKeyOrNameService,
      );

      const featureGroups = await listFeatureGroupsByKeyOrNameService.execute({
        key: 'ADMIN',
      });

      featureGroupId = featureGroups[0].id;
    }

    const encryptedPassword =
      await this.bcryptHashProvider.generateHash(password);

    return await this.usersRepository.create({
      id: generateNanoId(),
      name,
      email,
      password: encryptedPassword,
      featureGroupId,
    });
  }

  private async verifyFeatureGroup(featureGroupId: string): Promise<void> {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    await showFeatureGroupsService.execute(featureGroupId);
  }
}
