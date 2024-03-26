import { env } from '@shared/infra/environments/env';

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
const isProduction = env.NODE_ENV === 'production';

export const cookiesConfig = {
  path: '/',
  maxAge: oneDayInMilliseconds,
  httpOnly: true,
  secure: isProduction,
  sameSite: true,
};
