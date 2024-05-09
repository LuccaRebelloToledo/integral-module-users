import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import ListFeatureGroupsServiceParamsDTO from '../dtos/list-feature-groups-service-params.dto';
import ListFeatureGroupsServiceResponseDTO from '../dtos/list-feature-groups-service-response.dto';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';
import { calculatePaginationDetails } from '@shared/utils/calculate-pagination-details.utils';

@injectable()
export default class ListFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    key,
    name,
  }: ListFeatureGroupsServiceParamsDTO): Promise<ListFeatureGroupsServiceResponseDTO> {
    const skip = calculateSkip(page, limit);

    const { items, total } = await this.featureGroupRepository.findAll({
      take: limit,
      skip,
      sort,
      order,
      key,
      name,
    });

    if (!items.length) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
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
