import { inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import ListUsersServiceParamsDTO from '../dtos/list-users-service-params.dto';
import ListUsersServiceResponseDTO from '../dtos/list-users-service-response.dto';

import { convertPageAndLimitToInt } from '@shared/utils/convert-page-and-limit-to-int.utils';
import { calculateSkip } from '@shared/utils/calculate-skip.utils';
import { calculatePaginationDetails } from '@shared/utils/calculate-pagination-details.utils';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    name,
    email,
  }: ListUsersServiceParamsDTO): Promise<ListUsersServiceResponseDTO> {
    const { pageParsed, limitParsed } = convertPageAndLimitToInt(page, limit);

    const skip = calculateSkip(pageParsed, limitParsed);

    const { items, total } = await this.userRepository.findAll({
      take: limitParsed,
      skip,
      sort,
      order,
      name,
      email,
    });

    if (!items.length) {
      throw new AppError(AppErrorTypes.users.notFound, NOT_FOUND);
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
