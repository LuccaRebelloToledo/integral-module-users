import type { Request, Response } from 'express';

import { container } from 'tsyringe';

import { NO_CONTENT } from '@shared/infra/http/constants/http-status-code.constants';

import CreateUsersService from '@modules/users/services/create-users.service';
import AuthenticateUsersService from '@modules/users/services/authenticate-users.service';

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

    const token = await authenticateUsersService.execute({
      email,
      password,
    });

    return response.json(token);
  }
}
