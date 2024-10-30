import { EJwtTypes } from '../enums/jwt.enums';

import createJwtToken from './create-jwt-token.util';

const generateAccessAndRefreshTokens = (userId: string) => {
  const { ACCESS, REFRESH } = EJwtTypes;

  const accessToken = createJwtToken({ subject: userId, type: ACCESS });
  const refreshToken = createJwtToken({ subject: userId, type: REFRESH });

  return { accessToken, refreshToken };
};

export default generateAccessAndRefreshTokens;
