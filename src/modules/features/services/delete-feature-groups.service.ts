import { container, inject, injectable } from 'tsyringe';

import type IFeatureGroupsRepository from '../repositories/feature-groups.repository.interface';

import ShowFeatureGroupsService from './show-feature-groups.service';

@injectable()
export default class DeleteFeatureGroupsService {
  constructor(
    @inject('FeatureGroupsRepository')
    private readonly featureGroupsRepository: IFeatureGroupsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const showFeatureGroupsService = container.resolve(
      ShowFeatureGroupsService,
    );

    const featureGroup = await showFeatureGroupsService.execute(id);

    await this.featureGroupsRepository.delete(featureGroup.id);
  }
}
