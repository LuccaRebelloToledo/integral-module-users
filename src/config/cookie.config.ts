import { isProduction } from '@shared/infra/http/data-source';

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

export const cookiesConfig = {
  path: '/',
  maxAge: oneDayInMilliseconds,
  httpOnly: true,
  secure: isProduction,
  sameSite: true,
};
