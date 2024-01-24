import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListFeaturesService from '@modules/features/services/list-features.service';
import ListFeaturesByUserIdService from '@modules/features/services/list-features-by-user-id.service';
import ListFeaturesByFeatureGroupIdService from '@modules/features/services/list-features-by-feature-group-id.service';
import ListFeaturesByKeyOrNameService from '@modules/features/services/list-features-by-key-or-name.service';
import ShowFeaturesService from '@modules/features/services/show-features.service';

import ListByKeyOrNameQueryDTO from '@shared/dtos/list-by-key-or-name-query.dto';

export default class FeatureController {
  public async list(_request: Request, response: Response): Promise<Response> {
    const listFeaturesService = container.resolve(ListFeaturesService);

    const features = await listFeaturesService.execute();

    return response.json(features);
  }

  public async listByUserId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id: userId } = request.params;

    const listFeaturesByUserIdService = container.resolve(
      ListFeaturesByUserIdService,
    );

    const features = await listFeaturesByUserIdService.execute(userId);

    return response.json(features);
  }

  public async listByFeatureGroupId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id: featureGroupId } = request.params;

    const listFeaturesByFeatureGroupIdService = container.resolve(
      ListFeaturesByFeatureGroupIdService,
    );

    const features =
      await listFeaturesByFeatureGroupIdService.execute(featureGroupId);

    return response.json(features);
  }

  public async listByKeyOrName(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { key, name }: ListByKeyOrNameQueryDTO = request.query;

    const listFeaturesByKeyOrNameService = container.resolve(
      ListFeaturesByKeyOrNameService,
    );

    const features = await listFeaturesByKeyOrNameService.execute({
      key,
      name,
    });

    return response.json(features);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id: featureId } = request.params;

    const showFeaturesService = container.resolve(ShowFeaturesService);

    const feature = await showFeaturesService.execute(featureId);

    return response.json(feature);
  }
}
