import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth.config';

import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

type SessionFeature = {
  key: string;
  name: string;
};

type SessionFeatureGroup = {
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
    throw new AppError(AppErrorTypes.sessions.tokenNotFound, 401);
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    if (!decoded) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, 401);
    }

    const { sub, featureGroup, standaloneFeatures } = decoded as ITokenPayload;

    if (!sub || !featureGroup || !standaloneFeatures) {
      throw new AppError(AppErrorTypes.sessions.invalidToken, 401);
    }

    request.user = {
      id: sub,
      featureGroup,
      standaloneFeatures,
    };

    return next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new AppError(err.message, 401);
    }
    throw new AppError('Something is wrong!', 500);
  }
}
