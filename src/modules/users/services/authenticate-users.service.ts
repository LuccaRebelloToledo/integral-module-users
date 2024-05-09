import { inject, injectable } from 'tsyringe';

import AuthenticateUsersDTO from '../dtos/authenticate-users.dto';
import AuthenticateUsersResponseDTO from '../dtos/authenticate-users-response.dto';

import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import {
  FORBIDDEN,
  UNAUTHORIZED,
} from '@shared/infra/http/constants/http-status-code.constants';

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

    const sanitizedUser: Partial<User> = user;
    delete sanitizedUser['password'];

    const token = this.generateToken(user);

    return {
      user: sanitizedUser,
      token,
    };
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        AppErrorTypes.sessions.invalidCredentials,
        UNAUTHORIZED,
      );
    }

    await this.checkPassword(password, user);

    this.checkUserFeatures(user);

    return user;
  }

  private checkUserFeatures(user: User) {
    if (
      !user.featureGroup.features.length &&
      !user.standaloneFeatures?.length
    ) {
      throw new AppError(
        AppErrorTypes.sessions.missingUserFeatureGroup,
        FORBIDDEN,
      );
    }
  }

  private async checkPassword(password: string, user: User) {
    const passwordMatch = await this.bcryptHashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError(
        AppErrorTypes.sessions.invalidCredentials,
        UNAUTHORIZED,
      );
    }
  }

  private generateToken(user: User) {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
      algorithm: 'HS512',
    });

    return `Bearer ${token}`;
  }
}
