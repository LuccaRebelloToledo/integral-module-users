import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListFeaturesService from '@modules/features/services/list-features.service';

import ListFeaturesControllerParamsDto from '@modules/features/dtos/list-features-controller-params.dto';

export default class FeaturesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const {
      page,
      limit,
      order,
      sort,
      key,
      name,
    }: ListFeaturesControllerParamsDto = request.query;

    const listFeaturesService = container.resolve(ListFeaturesService);

    const features = await listFeaturesService.execute({
      page: page!,
      limit: limit!,
      order: order!,
      sort: sort!,
      key,
      name,
    });

    return response.json(features);
  }
}
