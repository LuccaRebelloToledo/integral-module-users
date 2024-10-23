import type { Request, Response } from 'express';

import { container } from 'tsyringe';

import { instanceToPlain } from 'class-transformer';

import {
  CREATED,
  NO_CONTENT,
} from '@shared/infra/http/constants/http-status-code.constants';

import CreateUsersService from '@modules/users/services/create-users.service';
import DeleteUsersService from '@modules/users/services/delete-users.service';
import ListUsersService from '@modules/users/services/list-users.service';
import ShowUsersService from '@modules/users/services/show-users.service';
import UpdateUsersService from '@modules/users/services/update-users.service';

import type ListUsersControllerParamsDto from '@modules/users/dtos/list-users-controller-params.dto';

export default class UsersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const {
      page,
      limit,
      order,
      sort,
      name,
      email,
    }: ListUsersControllerParamsDto = request.query;

    const listUsersService = container.resolve(ListUsersService);

    const users = await listUsersService.execute({
      page: page!,
      limit: limit!,
      order: order!,
      sort: sort!,
      name,
      email,
    });

    return response.json(instanceToPlain(users));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(id);

    return response.json(instanceToPlain(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUsersService = container.resolve(CreateUsersService);

    const user = await createUsersService.execute({
      name,
      email,
      password,
    });

    return response.status(CREATED).json(instanceToPlain(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const { name, email, password, featureGroupId } = request.body;

    const updateUsersService = container.resolve(UpdateUsersService);

    const user = await updateUsersService.execute({
      id,
      name,
      email,
      password,
      featureGroupId,
    });

    return response.json(instanceToPlain(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteUsersService = container.resolve(DeleteUsersService);

    await deleteUsersService.execute(id);

    return response.status(NO_CONTENT).json();
  }
}
