import { inject, injectable } from 'tsyringe';

import IFeaturesRepository from '../repositories/features.repository.interface';
import Feature from '../infra/typeorm/entities/feature.entity';

import ListFeaturesServiceParamsDTO from '../dtos/list-features-service-params.dto';
import ListServiceResponseDto from '@shared/dtos/list-service-response.dto';

import calculateSkip from '@shared/utils/calculate-skip.utils';
import calculatePaginationDetails from '@shared/utils/calculate-pagination-details.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ListFeaturesService {
  constructor(
    @inject('FeaturesRepository')
    private featuresRepository: IFeaturesRepository,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    key,
    name,
  }: ListFeaturesServiceParamsDTO): Promise<ListServiceResponseDto<Feature>> {
    const skip = calculateSkip(page, limit);

    const { items, total } = await this.featuresRepository.findAll({
      take: limit,
      skip,
      sort,
      order,
      key,
      name,
    });

    if (!items.length) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
    }

    const { previous, next, totalPages } = calculatePaginationDetails(
      total,
      page,
      limit,
    );

    return {
      pagination: {
        previous,
        current: page,
        next,
        total: totalPages,
      },
      totalItems: total,
      items,
    };
  }
}
