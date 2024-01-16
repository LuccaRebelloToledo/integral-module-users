import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth.config';

import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

interface ITokenPayload {
  sub: string;
  exp: number;
  iat: number;
}

export default function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const token = request.cookies.token;

  if (!token) {
    throw new AppError(AppErrorTypes.sessions.tokenNotFound, 401);
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;

    if (!decoded || !decoded.sub || !decoded.exp || !decoded.iat) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, 401);
    }

    request.session.user = {
      id: decoded.sub,
    };

    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new AppError(err.message, 401);
    }
    throw new AppError('Something is wrong!', 500);
  }
}
