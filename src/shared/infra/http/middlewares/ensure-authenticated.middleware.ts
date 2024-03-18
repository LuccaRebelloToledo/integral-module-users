import { Request, Response, NextFunction } from 'express';

import { JwtPayload, verify } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from '../constants/http-status-code.constants';

export default function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const token = request.cookies.token;

  if (!token) {
    throw new AppError(AppErrorTypes.sessions.tokenNotFound, UNAUTHORIZED);
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    if (!decoded) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
    }

    const { sub } = decoded as JwtPayload;

    if (!sub) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
    }

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message, error.statusCode);
    }

    throw new AppError('Something is wrong!', INTERNAL_SERVER_ERROR);
  }
}
