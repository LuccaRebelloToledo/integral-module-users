import { inject, injectable } from 'tsyringe';

import UsersRepositoryInterface from '../repositories/users.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

import ListUsersServiceParamsDTO from '../dtos/list-users-service-params.dto';
import ListUsersServiceResponseDTO from '../dtos/list-users-service-response.dto';

import { calculateSkip } from '@shared/utils/calculate-skip.utils';
import { calculatePaginationDetails } from '@shared/utils/calculate-pagination-details.utils';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    name,
    email,
  }: ListUsersServiceParamsDTO): Promise<ListUsersServiceResponseDTO> {
    const skip = calculateSkip(page, limit);

    const { items, total } = await this.usersRepository.findAll({
      take: limit,
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
