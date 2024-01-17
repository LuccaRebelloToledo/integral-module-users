import { container, inject, injectable } from 'tsyringe';

import AuthenticateUsersDTO from '../dtos/authenticate-users.dto';
import AuthenticateUsersResponseDTO from '../dtos/authenticate-users-response.dto';

import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import ShowFeaturesByFeatureGroupIdService from '@modules/features/services/show-features-by-feature-group-id.service';

import authConfig from '@config/auth.config';
import { sign } from 'jsonwebtoken';

@injectable()
export default class AuthenticateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}
  public async execute({
    email,
    password,
  }: AuthenticateUsersDTO): Promise<AuthenticateUsersResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    const passwordMatch = await this.bcryptHashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    if (!user.featureGroup) {
      throw new AppError(AppErrorTypes.sessions.missingUserFeatureGroup);
    }

    const showFeaturesByFeatureGroupIdService = container.resolve(
      ShowFeaturesByFeatureGroupIdService,
    );

    const featuresFromFeatureGroup =
      await showFeaturesByFeatureGroupIdService.execute(user.featureGroupId);

    const mappedFeaturesFromFeatureGroup = featuresFromFeatureGroup.map(
      (feature) => ({
        key: feature.key,
        name: feature.name,
      }),
    );

    const standaloneFeatures = user.features
      ? user.features.map((feature) => ({
          key: feature.key,
          name: feature.name,
        }))
      : [];

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        featureGroup: {
          key: user.featureGroup.key,
          name: user.featureGroup.name,
          features: mappedFeaturesFromFeatureGroup,
        },
        standaloneFeatures,
      },
      secret,
      {
        subject: user.id,
        expiresIn,
        algorithm: 'HS512',
      },
    );

    return {
      token: token,
    };
  }
}
