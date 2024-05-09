import { Request, Response, NextFunction } from 'express';

import { JwtPayload, verify } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { UNAUTHORIZED } from '../constants/http-status-code.constants';

export default function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const token = request.headers.authorization;

  if (!token) {
    throw new AppError(AppErrorTypes.sessions.tokenNotFound, UNAUTHORIZED);
  }

  const sanitizedToken = token.split(' ')[1];

  const decoded = verify(sanitizedToken, authConfig.jwt.secret);

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
}
