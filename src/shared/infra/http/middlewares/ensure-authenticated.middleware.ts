import type { NextFunction, Request, Response } from 'express';

import authConfig from '@config/auth.config';
import { type JwtPayload, verify } from 'jsonwebtoken';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { EJwtTypes } from '@modules/users/enums/jwt.enums';
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

  const { sub, type } = decoded as JwtPayload;

  if (!sub || !type || type !== EJwtTypes.ACCESS) {
    throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
  }

  request.user = {
    id: sub,
  };

  next();
}
