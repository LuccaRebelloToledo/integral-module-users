import { container, inject, injectable } from 'tsyringe';

import UpdateUsersDTO from '../dtos/update-users.dto';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import User from '../infra/typeorm/entities/user.entity';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import ListFeatureGroupsService from '@modules/features/services/list-feature-groups.service';
import ListFeaturesService from '@modules/features/services/list-features.service';
import ShowFeaturesByFeatureGroupIdService from '@modules/features/services/show-features-by-feature-group-id.service';
import ShowFeaturesByUserIdService from '@modules/features/services/show-features-by-user-id.service';

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
      const listFeatureGroupsService = container.resolve(
        ListFeatureGroupsService,
      );

      const featureGroup = await listFeatureGroupsService.execute(
        featureGroupId,
      );

      user.featureGroupId = featureGroup.id;
      user.featureGroup = featureGroup;
    }

    if (featureIds) {
      let features: Feature[] = [];
      const listFeaturesService = container.resolve(ListFeaturesService);

      for (let featureId of featureIds) {
        try {
          const feature = await listFeaturesService.execute(featureId);

          features.push(feature);
        } catch (err) {
          continue;
        }
      }

      if (!features.length) {
        throw new AppError(AppErrorTypes.features.notFound);
      }

      const showFeaturesByFeatureGroupIdService = container.resolve(
        ShowFeaturesByFeatureGroupIdService,
      );

      const groupedFeatures = await showFeaturesByFeatureGroupIdService.execute(
        user.featureGroupId,
      );

      const showFeaturesByUserIdService = container.resolve(
        ShowFeaturesByUserIdService,
      );

      const featuresByUserId = await showFeaturesByUserIdService.execute(
        user.id,
      );

      const combinedFeatures = [...groupedFeatures, ...featuresByUserId];

      const uniqueFeatures = features.filter(
        (feature) =>
          !combinedFeatures.some(
            (combinedFeature) => combinedFeature.id === feature.id,
          ),
      );

      if (!uniqueFeatures.length) {
        throw new AppError(AppErrorTypes.features.repeatedFeatures);
      }

      user.features = [...featuresByUserId, ...uniqueFeatures];
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }
}
