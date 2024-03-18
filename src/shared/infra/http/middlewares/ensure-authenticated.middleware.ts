import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth.config';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from '../constants/http-status-code.constants';

type SessionFeature = {
  key: string;
  name: string;
};

export type SessionFeatureGroup = {
  key: string;
  name: string;
  features: SessionFeature[];
};

export type SessionUser = {
  id: string;
  featureGroup: SessionFeatureGroup;
  standaloneFeatures: SessionFeature[];
};

interface ITokenPayload {
  sub: string;
  exp: number;
  iat: number;
  featureGroup: SessionFeatureGroup;
  standaloneFeatures: SessionFeature[];
}

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

    const { sub, featureGroup, standaloneFeatures } = decoded as ITokenPayload;

    if (!sub && !featureGroup && !standaloneFeatures) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, UNAUTHORIZED);
    }

    request.user = {
      id: sub,
      featureGroup,
      standaloneFeatures,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message, error.statusCode);
    }

    throw new AppError('Something is wrong!', INTERNAL_SERVER_ERROR);
  }
}
