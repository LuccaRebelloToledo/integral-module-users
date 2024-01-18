export default interface UpdateUsersDTO {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  featureGroupId?: string;
  featureIds?: string[];
}
