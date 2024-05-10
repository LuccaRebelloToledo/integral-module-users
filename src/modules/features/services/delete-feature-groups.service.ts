import { container, inject, injectable } from 'tsyringe';

import FeatureGroupsRepositoryInterface from '../repositories/feature-groups.repository.interface';

import ShowFeatureGroupsService from './show-feature-groups.service';

@injectable()
export default class DeleteFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private featureGroupsRepository: FeatureGroupsRepositoryInterface,
  ) {}

  public async execute(featureGroupId: string): Promise<void> {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    const featureGroup = await showFeatureGroupsService.execute(featureGroupId);

    await this.featureGroupsRepository.delete(featureGroup);
  }
}
