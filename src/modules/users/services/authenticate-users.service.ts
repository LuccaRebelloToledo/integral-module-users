import { container, inject, injectable } from 'tsyringe';

import AuthenticateUsersDTO from '../dtos/authenticate-users.dto';
import AuthenticateUsersResponseDTO from '../dtos/authenticate-users-response.dto';
import MappedFeaturesInterface from '../dtos/mapped-feature.dto';

import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import ListFeaturesByFeatureGroupIdService from '@modules/features/services/list-features-by-feature-group-id.service';

import Feature from '@modules/features/infra/typeorm/entities/feature.entity';
import User from '../infra/typeorm/entities/user.entity';

import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

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
    const user = await this.validateUser(email, password);

    const features = await this.getUserFeatures(user);

    const token = this.generateToken(
      user,
      features.groupedFeatures!,
      features.standaloneFeatures!,
    );

    return {
      token,
    };
  }

  private mapFeatures(features?: Feature[]) {
    return features?.map((feature) => ({
      key: feature.key,
      name: feature.name,
    }));
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    if (
      !user.featureGroup.features.length &&
      !user.standaloneFeatures?.length
    ) {
      throw new AppError(AppErrorTypes.sessions.missingUserFeatureGroup);
    }

    const passwordMatch = await this.bcryptHashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError(AppErrorTypes.sessions.invalidCredentials);
    }

    return user;
  }

  private async getUserFeatures(user: User) {
    const listFeaturesByFeatureGroupIdService = container.resolve(
      ListFeaturesByFeatureGroupIdService,
    );

    const groupedFeatures = await listFeaturesByFeatureGroupIdService.execute(
      user.featureGroupId,
    );

    const mappedGroupedFeatures = this.mapFeatures(groupedFeatures);

    const standaloneFeatures = this.mapFeatures(user.standaloneFeatures);

    return {
      groupedFeatures: mappedGroupedFeatures,
      standaloneFeatures,
    };
  }

  private generateToken(
    user: User,
    groupedFeatures: MappedFeaturesInterface[],
    standaloneFeatures: MappedFeaturesInterface[],
  ) {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      {
        featureGroup: {
          key: user.featureGroup.key,
          name: user.featureGroup.name,
          features: groupedFeatures,
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

    return token;
  }
}
