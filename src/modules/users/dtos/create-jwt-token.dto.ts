import type { EJwtTypes } from '../enums/jwt.enums';

export default interface ICreateJwtTokenDto {
  subject: string;
  type: EJwtTypes;
}
