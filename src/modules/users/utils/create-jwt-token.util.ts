import { type SignOptions, sign } from 'jsonwebtoken';

import authConfig from '@config/auth.config';

import type ICreateJwtTokenDto from '../dtos/create-jwt-token.dto';

import { EJwtTypes } from '../enums/jwt.enums';

const createJwtToken = ({ subject, type }: ICreateJwtTokenDto) => {
  const { secret, accessExpiresIn, refreshExpiresIn } = authConfig.jwt;

  const expiresIn =
    type === EJwtTypes.ACCESS ? accessExpiresIn : refreshExpiresIn;
  const algorithm: SignOptions['algorithm'] = 'HS256';

  const token = sign(
    {
      type,
    },
    secret,
    {
      subject,
      expiresIn,
      algorithm,
    },
  );

  return token;
};

export default createJwtToken;
