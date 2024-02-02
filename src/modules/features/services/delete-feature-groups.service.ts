import { container, inject, injectable } from 'tsyringe';

import FeatureGroupRepositoryInterface from '../repositories/feature-group.repository.interface';

import ShowFeatureGroupsService from './show-feature-groups.service';

@injectable()
export default class DeleteFeatureGroupsService {
  constructor(
    @inject('FeatureGroupRepository')
    private featureGroupRepository: FeatureGroupRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<void> {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    const featureGroup = await showFeatureGroupsService.execute(featureGroupId);

    await this.featureGroupRepository.delete(featureGroup);
  }
}
