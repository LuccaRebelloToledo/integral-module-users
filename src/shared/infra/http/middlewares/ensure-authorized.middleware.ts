import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { FORBIDDEN } from '../constants/http-status-code.constants';

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
    const { featureGroup, standaloneFeatures } = request.user;

    const combinedFeatures = [...featureGroup.features, ...standaloneFeatures];

    if (
      !combinedFeatures.find((userFeature) =>
        requiredFeatures.includes(userFeature.key),
      )
    ) {
      throw new AppError(
        AppErrorTypes.sessions.insufficientPrivilege,
        FORBIDDEN,
      );
    }

    return next();
  }

  return authorize;
}
