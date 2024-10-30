import { inject, injectable } from 'tsyringe';

import type IUserTokensRepository from '../repositories/user-tokens.repository.interface';

import type AuthenticateUsersResponseDTO from '../dtos/authenticate-users-response.dto';

import authConfig from '@config/auth.config';
import { type JwtPayload, verify } from 'jsonwebtoken';
import { EJwtTypes } from '../enums/jwt.enums';

import generateAccessAndRefreshTokens from '../utils/generate-access-and-refresh-tokens.util';
import getUserById from '../utils/get-user-by-id.util';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { UNAUTHORIZED } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class RefreshTokenUsersService {
  constructor(
    @inject('UserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(
    refreshToken: string,
  ): Promise<AuthenticateUsersResponseDTO> {
    const decoded = verify(refreshToken, authConfig.jwt.secret);

    if (!decoded) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
    }

    const { sub, type } = decoded as JwtPayload;

    if (!sub || !type || type !== EJwtTypes.REFRESH) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
    }

    const [user, tokens] = await Promise.all([
      getUserById(sub),
      this.userTokensRepository.findAllByUserId(sub),
    ]);

    const userToken = tokens.find(
      (token) => token.refreshToken === refreshToken,
    );

    if (!userToken) {
      throw new AppError(AppErrorTypes.sessions.tokenNotFound, UNAUTHORIZED);
    }

    await this.userTokensRepository.delete(userToken.id);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateAccessAndRefreshTokens(user.id);

    await this.userTokensRepository.create({
      userId: user.id,
      refreshToken: newRefreshToken,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
