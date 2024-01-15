import { Request, Response, NextFunction } from 'express';

import { container } from 'tsyringe';

import CreateUsersService from '@modules/users/services/create-users.service';
import AuthenticateUsersService from '@modules/users/services/authenticate-users.service';

export default class SessionController {
  public async signUp(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { name, email, password } = request.body;
    console.log(request.body);

    const createUsersService = container.resolve(CreateUsersService);
    await createUsersService.execute({ name, email, password });

    next();
  }

  public async signIn(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUsersService = container.resolve(
      AuthenticateUsersService,
    );
    const token = await authenticateUsersService.execute({ email, password });

    return response.cookie('token', token).status(204).json();
  }
}
