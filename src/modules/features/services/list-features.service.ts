import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import ListFeaturesServiceParamsDTO from '../dtos/list-features-service-params.dto';
import ListFeaturesServiceResponseDTO from '../dtos/list-features-service-response.dto';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';
import { calculatePaginationDetails } from '@shared/utils/calculate-pagination-details.utils';

@injectable()
export default class ListFeaturesService {
  constructor(
    @inject('FeatureRepository')
    private featureRepository: FeatureRepositoryInterface,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    key,
    name,
  }: ListFeaturesServiceParamsDTO): Promise<ListFeaturesServiceResponseDTO> {
    const skip = calculateSkip(page, limit);

    const { items, total } = await this.featureRepository.findAll({
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
