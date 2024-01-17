const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
import { isProduction } from '@shared/infra/http/data-source';

const cookiesConfig = {
  path: '/',
  maxAge: oneDayInMilliseconds,
  httpOnly: true,
  secure: isProduction,
  sameSite: true,
};

export default cookiesConfig;
