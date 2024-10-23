import type Feature from '../infra/typeorm/entities/feature.entity';

export default class CreateFeatureGroupsDto {
  key: string;
  name: string;
  features: Feature[];
}
