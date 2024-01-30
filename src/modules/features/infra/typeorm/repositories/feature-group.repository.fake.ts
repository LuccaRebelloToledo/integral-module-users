import { TestDataSource } from '@shared/infra/http/test-data-source';

import { Repository } from 'typeorm';

import FeatureGroupRepositoryInterface from '@modules/features/repositories/feature-group.repository.interface';
import FeatureGroup from '../entities/feature-group.entity';

import FindFeatureGroupsByKeyOrNameDTO from '@modules/features/dtos/find-feature-groups-by-key-or-name.dto';
import CreateFeatureGroupsDTO from '@modules/features/dtos/create-feature-groups.dto';

export default class FakeFeatureGroupRepository
  implements FeatureGroupRepositoryInterface
{
  private featureGroupRepository: Repository<FeatureGroup>;

  constructor() {
    this.featureGroupRepository = TestDataSource.getRepository(FeatureGroup);
  }

  public async findAll(): Promise<FeatureGroup[]> {
    return await this.featureGroupRepository.find();
  }

  public async findById(featureGroupId: string): Promise<FeatureGroup | null> {
    return await this.featureGroupRepository.findOne({
      where: {
        id: featureGroupId,
      },
    });
  }

  public async findByKeyOrName({
    key,
    name,
  }: FindFeatureGroupsByKeyOrNameDTO): Promise<FeatureGroup[]> {
    let query =
      this.featureGroupRepository.createQueryBuilder('feature_groups');

    if (key) {
      query = query.where('LOWER(feature_groups.key) LIKE :key', {
        key: `%${key.toLowerCase()}%`,
      });
    }

    if (name) {
      query = query.orWhere('LOWER(feature_groups.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    return await query.getMany();
  }

  public async create(
    featureGroupData: CreateFeatureGroupsDTO,
  ): Promise<FeatureGroup> {
    const featureGroup = this.featureGroupRepository.create(featureGroupData);

    return await this.save(featureGroup);
  }

  public async save(featureGroup: FeatureGroup): Promise<FeatureGroup> {
    return await this.featureGroupRepository.save(featureGroup);
  }

  public async delete(featureGroup: FeatureGroup): Promise<void> {
    await this.featureGroupRepository.delete(featureGroup.id);
  }
}
