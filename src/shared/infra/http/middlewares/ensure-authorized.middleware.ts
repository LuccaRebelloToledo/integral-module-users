import { Request, Response, NextFunction } from 'express';

import { container } from 'tsyringe';

import ShowUsersService from '@modules/users/services/show-users.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { FORBIDDEN } from '../constants/http-status-code.constants';

interface IAuthLevelMiddleware {
  (request: Request, response: Response, next: NextFunction): void;
}

export default function ensureAuthorized(
  requiredFeatures: Array<string>,
): IAuthLevelMiddleware {
  async function authorize(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = request.user;

    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(id);

    const features = user.featureGroup.features;

    if (!features.find((feature) => requiredFeatures.includes(feature.key))) {
      throw new AppError(
        AppErrorTypes.sessions.insufficientPrivilege,
        FORBIDDEN,
      );
    }

    return next();
  }

  return authorize;
}
