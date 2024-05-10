import { Request, Response } from 'express';

import { container } from 'tsyringe';

import {
  CREATED,
  NO_CONTENT,
} from '@shared/infra/http/constants/http-status-code.constants';

import ListUsersService from '@modules/users/services/list-users.service';
import ShowUsersService from '@modules/users/services/show-users.service';
import CreateUsersService from '@modules/users/services/create-users.service';
import UpdateUsersService from '@modules/users/services/update-users.service';
import DeleteUsersService from '@modules/users/services/delete-users.service';

import UserPaginationControllerParamsDTO from '@modules/users/dtos/user-pagination-controller-params.dto';

export default class UsersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const {
      page,
      limit,
      order,
      sort,
      name,
      email,
    }: UserPaginationControllerParamsDTO = request.query;

    const listUsersService = container.resolve(ListUsersService);
    const users = await listUsersService.execute({
      page: page!,
      limit: limit!,
      order: order!,
      sort: sort!,
      name,
      email,
    });

    return response.json(users);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.params;

    const showUsersService = container.resolve(ShowUsersService);
    const user = await showUsersService.execute(userId);

    return response.json(user);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, featureGroupId } = request.body;

    const createUsersService = container.resolve(CreateUsersService);
    await createUsersService.execute({
      name,
      email,
      password,
      featureGroupId,
    });

    return response.status(CREATED).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.params;
    const { name, email, password, featureGroupId, featureIds } = request.body;

    const updateUsersService = container.resolve(UpdateUsersService);
    const user = await updateUsersService.execute({
      id: userId,
      name,
      email,
      password,
      featureGroupId,
      featureIds,
    });

    return response.json(user);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.params;

    const deleteUsersService = container.resolve(DeleteUsersService);
    await deleteUsersService.execute(userId);

    return response.status(NO_CONTENT).json();
  }
}
