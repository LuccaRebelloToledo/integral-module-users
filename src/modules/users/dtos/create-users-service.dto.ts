export default interface CreateUsersServiceDTO {
  email: string;
  password: string;
  name: string;
  featureGroupId?: string;
}
