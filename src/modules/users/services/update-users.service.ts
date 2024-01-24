import { container, inject, injectable } from 'tsyringe';

import UpdateUsersDTO from '../dtos/update-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import User from '../infra/typeorm/entities/user.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';
import ShowFeaturesService from '@modules/features/services/show-features.service';
import ListFeaturesByFeatureGroupIdService from '@modules/features/services/list-features-by-feature-group-id.service';
import ListFeaturesByUserIdService from '@modules/features/services/list-features-by-user-id.service';

import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

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
    featureGroupId,
    featureIds,
  }: UpdateUsersDTO): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError(AppErrorTypes.users.notFound, 404);
    }

    if (name) {
      if (user.name !== name) {
        user.name = name;
      }
    }

    if (email) {
      const userWithEmail = await this.userRepository.findByEmail(email);

      if (userWithEmail) {
        throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
      }

      user.email = email;
    }

    if (password) {
      const encryptedPassword = await this.bcryptHashProvider.generateHash(
        password,
      );

      user.password = encryptedPassword;
    }

    if (featureGroupId) {
      const showFeatureGroupsService = container.resolve(
        ShowFeatureGroupsService,
      );

      const featureGroup = await showFeatureGroupsService.execute(
        featureGroupId,
      );

      user.featureGroupId = featureGroup.id;
      user.featureGroup = featureGroup;
    }

    if (featureIds) {
      let features: Feature[] = [];
      const showFeaturesService = container.resolve(ShowFeaturesService);

      for (let featureId of featureIds) {
        try {
          const feature = await showFeaturesService.execute(featureId);

          features.push(feature);
        } catch (err) {
          continue;
        }
      }

      if (!!features.length) {
        throw new AppError(AppErrorTypes.features.notFound);
      }

      const listFeaturesByFeatureGroupIdService = container.resolve(
        ListFeaturesByFeatureGroupIdService,
      );

      const groupedFeatures = await listFeaturesByFeatureGroupIdService.execute(
        user.featureGroupId,
      );

      const listFeaturesByUserIdService = container.resolve(
        ListFeaturesByUserIdService,
      );

      const featuresByUserId = await listFeaturesByUserIdService.execute(
        user.id,
      );

      const combinedFeatures = [...groupedFeatures, ...featuresByUserId];

      const uniqueFeatures = features.filter(
        (feature) =>
          !combinedFeatures.some(
            (combinedFeature) => combinedFeature.id === feature.id,
          ),
      );

      if (!!uniqueFeatures.length) {
        throw new AppError(AppErrorTypes.features.repeatedFeatures);
      }

      user.standaloneFeatures = [...featuresByUserId, ...uniqueFeatures];
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }
}
