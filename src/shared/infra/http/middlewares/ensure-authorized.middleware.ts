import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

interface IAuthLevelMiddleware {
  (request: Request, response: Response, next: NextFunction): void;
}

export default function ensureAuthorized(
  requiredFeatures: Array<string>,
): IAuthLevelMiddleware {
  function authorize(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void {
    const { featureGroup, features } = request.user;

    if (
      ![...featureGroup.features, ...features].some((userFeature) =>
        requiredFeatures.includes(userFeature.key),
      )
    ) {
      throw new AppError(AppErrorTypes.sessions.insufficientPrivilege, 403);
    }

    return next();
  }

  return authorize;
}
