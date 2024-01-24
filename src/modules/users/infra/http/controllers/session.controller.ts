import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateUsersService from '@modules/users/services/create-users.service';
import AuthenticateUsersService from '@modules/users/services/authenticate-users.service';

import cookiesConfig from '@config/cookie.config';

export default class SessionController {
  public async signUp(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsersService = container.resolve(CreateUsersService);

    const user = await createUsersService.execute({ name, email, password });

    return response.status(201).json(user);
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

    return response.cookie('token', token, cookiesConfig).status(204).json();
  }
}
