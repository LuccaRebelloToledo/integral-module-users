import Feature from '../infra/typeorm/entities/feature.entity';

export default class CreateFeatureGroupsDTO {
  id: string;
  key: string;
  name: string;
  features: Feature[];
}
