import type { Request, Response } from 'express';

import { container } from 'tsyringe';

import { NO_CONTENT } from '@shared/infra/http/constants/http-status-code.constants';

import AuthenticateUsersService from '@modules/users/services/authenticate-users.service';
import CreateUsersService from '@modules/users/services/create-users.service';
import RefreshTokenUsersService from '@modules/users/services/refresh-token-users.service';

export default class SessionsController {
  public async signUp(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsersService = container.resolve(CreateUsersService);

    await createUsersService.execute({ name, email, password });

    return response.status(NO_CONTENT).json();
  }

  public async signIn(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUsersService = container.resolve(
      AuthenticateUsersService,
    );

    const tokens = await authenticateUsersService.execute({
      email,
      password,
    });

    return response.json(tokens);
  }

  public async refreshToken(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { refreshToken } = request.body;

    const refreshTokenUsersService = container.resolve(
      RefreshTokenUsersService,
    );

    const tokens = await refreshTokenUsersService.execute(refreshToken);

    return response.json(tokens);
  }
}
