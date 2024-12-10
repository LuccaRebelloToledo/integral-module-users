import { inject, injectable } from 'tsyringe';

import type User from '../infra/typeorm/entities/user.entity';
import type IHashProvider from '../providers/hash-provider/models/hash.provider.interface';
import type IUserTokensRepository from '../repositories/user-tokens.repository.interface';
import type IUsersRepository from '../repositories/users.repository.interface';

import type AuthenticateUsersResponseDto from '../dtos/authenticate-users-response.dto';
import type AuthenticateUsersDto from '../dtos/authenticate-users.dto';

import generateAccessAndRefreshTokens from '../utils/generate-access-and-refresh-tokens.util';

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

    @inject('UserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticateUsersDto): Promise<AuthenticateUsersResponseDto> {
    const user = await this.validateUser(email, password);

    const userId = user.id;

    const { accessToken, refreshToken } =
      generateAccessAndRefreshTokens(userId);

    await this.userTokensRepository.create({
      userId,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validatePassword(password: string, user: User) {
    const isPasswordValid = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError(
        AppErrorTypes.sessions.invalidCredentials,
        UNAUTHORIZED,
      );
    }
  }

  private checkUserFeatures(user: User) {
    if (!user.featureGroup.features.length) {
      throw new AppError(
        AppErrorTypes.sessions.missingUserFeatureGroup,
        FORBIDDEN,
      );
    }
  }

  public async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        AppErrorTypes.sessions.invalidCredentials,
        UNAUTHORIZED,
      );
    }

    await this.validatePassword(password, user);

    this.checkUserFeatures(user);

    return user;
  }
}
