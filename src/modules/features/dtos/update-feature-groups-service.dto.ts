import CreateFeatureGroupsServiceDto from './create-feature-groups-service.dto';

export default interface UpdateFeatureGroupsServiceDto
  extends Partial<CreateFeatureGroupsServiceDto> {
  id: string;
}
