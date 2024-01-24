import { Request, Response, NextFunction } from 'express';

import { container } from 'tsyringe';

import ListFeatureGroupsService from '@modules/features/services/list-feature-groups.service';
import ListFeatureGroupsByKeyOrNameService from '@modules/features/services/list-feature-groups-by-key-or-name.service';
import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';
import CreateFeatureGroupsService from '@modules/features/services/create-feature-groups.service';
import UpdateFeatureGroupsService from '@modules/features/services/update-feature-groups.service';
import DeleteFeatureGroupsService from '@modules/features/services/delete-feature-groups.service';

import ListByKeyOrNameQueryDTO from '@shared/dtos/list-by-key-or-name-query.dto';

export default class FeatureGroupController {
  public async list(
    _request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const listFeatureGroupsService = container.resolve(
      ListFeatureGroupsService,
    );

    const featureGroups = await listFeatureGroupsService.execute();

    return response.json(featureGroups);
  }

  public async listByKeyOrName(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { key, name }: ListByKeyOrNameQueryDTO = request.query;

    const listFeatureGroupsByKeyOrNameService = container.resolve(
      ListFeatureGroupsByKeyOrNameService,
    );

    const featureGroups = await listFeatureGroupsByKeyOrNameService.execute({
      key,
      name,
    });

    return response.json(featureGroups);
  }

  public async show(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: featureGroupId } = request.params;

    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    const featureGroup = await showFeatureGroupsService.execute(featureGroupId);

    return response.json(featureGroup);
  }

  public async create(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { key, name, featureIds } = request.body;

    const createFeatureGroupsService = container.resolve(
      CreateFeatureGroupsService,
    );

    const featureGroup = await createFeatureGroupsService.execute({
      key,
      name,
      featureIds,
    });

    return response.status(201).json(featureGroup);
  }

  public async update(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: featureGroupId } = request.params;

    const { key, name, featureIds } = request.body;

    const updateFeatureGroupsService = container.resolve(
      UpdateFeatureGroupsService,
    );

    const featureGroup = await updateFeatureGroupsService.execute({
      featureGroupId,
      key,
      name,
      featureIds,
    });

    return response.json(featureGroup);
  }

  public async delete(
    request: Request,
    response: Response,
    _next: NextFunction,
  ): Promise<Response> {
    const { id: featureGroupId } = request.params;

    const deleteFeatureGroupsService = container.resolve(
      DeleteFeatureGroupsService,
    );

    await deleteFeatureGroupsService.execute(featureGroupId);

    return response.status(204).json();
  }
}
