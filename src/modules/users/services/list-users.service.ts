import { inject, injectable } from 'tsyringe';

import type IUsersRepository from '../repositories/users.repository.interface';
import type User from '../infra/typeorm/entities/user.entity';

import type ListUsersServiceParamsDTO from '../dtos/list-users-service-params.dto';
import type ListServiceResponseDto from '@shared/dtos/list-service-response.dto';

import calculateSkip from '@shared/utils/calculate-skip.util';
import getPageMetaDetails from '@shared/utils/get-page-meta-details.util';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    page,
    limit,
    sort,
    order,
    name,
    email,
  }: ListUsersServiceParamsDTO): Promise<ListServiceResponseDto<User>> {
    const skip = calculateSkip({ page, limit });

    const { data, totalItems } = await this.usersRepository.findAll({
      take: limit,
      skip,
      sort,
      order,
      name,
      email,
    });

    if (!data.length) {
      throw new AppError(AppErrorTypes.users.notFound, NOT_FOUND);
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
