import { inject, injectable } from 'tsyringe';

import FeatureRepositoryInterface from '../repositories/feature.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import ListFeaturesServiceParamsDTO from '../dtos/list-features-service-params.dto';
import ListFeaturesServiceResponseDTO from '../dtos/list-features-service-response.dto';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';
import { convertPageAndLimitToInt } from '@shared/utils/convert-page-and-limit-to-int.utils';
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
    const { pageParsed, limitParsed } = convertPageAndLimitToInt(page, limit);

    const skip = calculateSkip(pageParsed, limitParsed);

    const { items, total } = await this.featureRepository.findAll({
      take: limitParsed,
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
      pageParsed,
      limitParsed,
    );

    return {
      pagination: {
        previous,
        current: pageParsed,
        next,
        total: totalPages,
      },
      totalItems: total,
      items,
    };
  }
}
