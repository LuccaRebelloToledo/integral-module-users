import { inject, injectable } from 'tsyringe';

import type User from '../infra/typeorm/entities/user.entity';
import type IHashProvider from '../providers/hash-provider/models/hash.provider.interface';
import type IUsersRepository from '../repositories/users.repository.interface';

import type AuthenticateUsersResponseDTO from '../dtos/authenticate-users-response.dto';
import type AuthenticateUsersDTO from '../dtos/authenticate-users.dto';

import authConfig from '@config/auth.config';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import {
  FORBIDDEN,
  UNAUTHORIZED,
} from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class AuthenticateUsersService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticateUsersDTO): Promise<AuthenticateUsersResponseDTO> {
    const user = await this.validateUser(email, password);

    const token = this.generateToken(user);

    return {
      token,
    };
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

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
    if (!user.featureGroup.features.length) {
      throw new AppError(
        AppErrorTypes.sessions.missingUserFeatureGroup,
        FORBIDDEN,
      );
    }
  }

  private async checkPassword(password: string, user: User) {
    const passwordMatch = await this.hashProvider.compareHash(
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
