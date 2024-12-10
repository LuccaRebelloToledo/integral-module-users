import { inject, injectable } from 'tsyringe';

import type Feature from '../infra/typeorm/entities/feature.entity';
import type IFeaturesRepository from '../repositories/features.repository.interface';

import type ListServiceResponseDto from '@shared/dtos/list-service-response.dto';
import type ListFeaturesServiceParamsDto from '../dtos/list-features-service-params.dto';

import calculateSkip from '@shared/utils/calculate-skip.util';
import getPageMetaDetails from '@shared/utils/get-page-meta-details.util';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ListFeaturesService {
  constructor(
    @inject('FeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    key,
    name,
  }: ListFeaturesServiceParamsDto): Promise<ListServiceResponseDto<Feature>> {
    const skip = calculateSkip({ page, limit });

    const { data, totalItems } = await this.featuresRepository.findAll({
      take: limit,
      skip,
      sort,
      order,
      key,
      name,
    });

    if (!data.length) {
      throw new AppError(AppErrorTypes.features.notFound, NOT_FOUND);
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
