import { inject, injectable } from 'tsyringe';

import IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';
import FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import ListFeatureGroupsServiceParamsDTO from '../dtos/list-feature-groups-service-params.dto';
import ListServiceResponseDto from '@shared/dtos/list-service-response.dto';

import calculateSkip from '@shared/utils/calculate-skip.utils';
import calculatePaginationDetails from '@shared/utils/calculate-pagination-details.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ListFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    key,
    name,
  }: ListFeatureGroupsServiceParamsDTO): Promise<
    ListServiceResponseDto<FeatureGroup>
  > {
    const skip = calculateSkip(page, limit);

    const { items, total } = await this.featureGroupsRepository.findAll({
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
