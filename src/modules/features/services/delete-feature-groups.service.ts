import { inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

@injectable()
export default class DeleteFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<void> {
    const featureGroupIdInput = featureGroupId.trim();

    const featureGroup = await this.featureGroupRepository.findById(
      featureGroupIdInput,
    );

    if (!featureGroup) {
      throw new AppError(AppErrorTypes.featureGroups.notFound);
    }

    await this.featureGroupRepository.delete(featureGroup);
  }
}
