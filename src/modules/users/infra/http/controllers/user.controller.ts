import { Request, Response, NextFunction } from 'express';

import { container } from 'tsyringe';

import ShowUsersService from '@modules/users/services/show-users.service';
import ListUsersService from '@modules/users/services/list-users.service';
import CreateUsersService from '@modules/users/services/create-users.service';
import UpdateUsersService from '@modules/users/services/update-users.service';
import DeleteUsersService from '@modules/users/services/delete-users.service';

export default class UserController {
  public async index(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: userId } = request.params;

    const showUsersService = container.resolve(ShowUsersService);
    const user = await showUsersService.execute(userId);

    return response.json(user);
  }

  public async show(
    _request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const listUsersService = container.resolve(ListUsersService);
    const users = await listUsersService.execute();

    return response.json(users);
  }

  public async create(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsersService = container.resolve(CreateUsersService);
    const user = await createUsersService.execute({ name, email, password });

    return response.status(201).json(user);
  }

  public async update(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: userId } = request.params;
    const { name, email, password } = request.body;

    const updateUsersService = container.resolve(UpdateUsersService);
    const user = await updateUsersService.execute({
      id: userId,
      name,
      email,
      password,
    });

    return response.json(user);
  }

  public async delete(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: userId } = request.params;

    const deleteUsersService = container.resolve(DeleteUsersService);
    await deleteUsersService.execute(userId);

    return response.status(204);
  }
}
