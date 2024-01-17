import Feature from '../infra/typeorm/entities/feature.entity';

export default class CreateFeatureGroupsDTO {
  key: string;
  name: string;
  features: Feature[];
}
