import { inject, injectable } from 'tsyringe';

import type IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';
import type FeatureGroup from '../infra/typeorm/entities/feature-group.entity';

import type ListFeatureGroupsServiceParamsDTO from '../dtos/list-feature-groups-service-params.dto';
import type ListServiceResponseDto from '@shared/dtos/list-service-response.dto';

import calculateSkip from '@shared/utils/calculate-skip.util';
import getPageMetaDetails from '@shared/utils/get-page-meta-details.util';

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
    const skip = calculateSkip({ page, limit });

    const { data, totalItems } = await this.featureGroupsRepository.findAll({
      take: limit,
      skip,
      sort,
      order,
      key,
      name,
    });

    if (!data.length) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    const meta = getPageMetaDetails({
      page,
      limit,
      totalItems,
    });

    return {
      meta,
      data,
    };
  }
}
