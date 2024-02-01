import { Request, Response } from 'express';

import { container } from 'tsyringe';

import {
  CREATED,
  NO_CONTENT,
} from '@shared/infra/http/constants/http-status-code.constants';

import { cookiesConfig } from '@config/cookie.config';

import CreateUsersService from '@modules/users/services/create-users.service';
import AuthenticateUsersService from '@modules/users/services/authenticate-users.service';

export default class SessionController {
  public async signUp(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsersService = container.resolve(CreateUsersService);

    await createUsersService.execute({ name, email, password });

    return response.status(CREATED).json();
  }

  public async signIn(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUsersService = container.resolve(
      AuthenticateUsersService,
    );

    const { token } = await authenticateUsersService.execute({
      email,
      password,
    });

    return response
      .cookie('token', token, cookiesConfig)
      .status(NO_CONTENT)
      .json();
  }
}
