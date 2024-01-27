import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

@injectable()
export default class DeleteFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<void> {
    const featureGroup =
      await this.featureGroupRepository.findById(featureGroupId);

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND);
    }

    await this.featureGroupRepository.delete(featureGroup);
  }
}
