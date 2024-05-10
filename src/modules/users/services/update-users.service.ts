import { container, inject, injectable } from 'tsyringe';

import UpdateUsersDTO from '../dtos/update-users.dto';

import UsersRepositoryInterface from '../repositories/users.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import User from '../infra/typeorm/entities/user.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { CONFLICT } from '@shared/infra/http/constants/http-status-code.constants';

import ShowUsersService from './show-users.service';
import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';
import ListFeaturesByFeatureGroupIdService from '@modules/features/services/list-features-by-feature-group-id.service';
import ListFeaturesByUserIdService from '@modules/features/services/list-features-by-user-id.service';

import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

import { getFeaturesByFeatureIds } from '@shared/utils/get-features-by-feature-ids.utils';

@injectable()
export default class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
    featureGroupId,
    featureIds,
  }: UpdateUsersDTO): Promise<User> {
    const user = await this.findUserById(id);

    this.updateName(user, name);

    if (email) {
      await this.updateEmail(user, email);
    }

    if (featureGroupId) {
      await this.updateFeatureGroup(user, featureGroupId);
    }

    if (featureIds) {
      await this.updateFeatures(user, featureIds);
    }

    if (password) {
      await this.updatePassword(user, password);
    }

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }

  private async findUserById(id: string): Promise<User> {
    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(id);

    return user;
  }

  private async updateEmail(user: User, email: string) {
    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail) {
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
    user.featureGroup = featureGroup;
  }

  private async updateFeatures(user: User, featureIds: string[]) {
    const features = await getFeaturesByFeatureIds(featureIds);

    const groupedFeatures = await this.getGroupedFeatures(user);

    const featuresByUserId = await this.getFeaturesByUserId(user);

    const uniqueFeatures = this.getUniqueFeatures(
      [...groupedFeatures, ...featuresByUserId],
      features,
    );

    user.standaloneFeatures = [...featuresByUserId, ...uniqueFeatures];
  }

  private async getGroupedFeatures(user: User) {
    const listFeaturesByFeatureGroupIdService = container.resolve(
      ListFeaturesByFeatureGroupIdService,
    );

    return await listFeaturesByFeatureGroupIdService.execute(
      user.featureGroupId,
    );
  }

  private async getFeaturesByUserId(user: User) {
    const listFeaturesByUserIdService = container.resolve(
      ListFeaturesByUserIdService,
    );

    return await listFeaturesByUserIdService.execute(user.id);
  }

  private getUniqueFeatures(combinedFeatures: Feature[], features: Feature[]) {
    const uniqueFeatures = features.filter(
      (feature) =>
        !combinedFeatures.some(
          (combinedFeature) => combinedFeature.id === feature.id,
        ),
    );

    if (!uniqueFeatures.length) {
      throw new AppError(AppErrorTypes.features.repeatedFeatures);
    }

    return uniqueFeatures;
  }

  private updateName(user: User, name: string) {
    if (user.name !== name) {
      user.name = name;
    }
  }

  private async updatePassword(user: User, password: string) {
    const encryptedPassword =
      await this.bcryptHashProvider.generateHash(password);

    user.password = encryptedPassword;
  }
}
