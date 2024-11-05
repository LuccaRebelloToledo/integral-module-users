import 'dotenv/config';

import { env } from 'node:process';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRATION,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRATION,
  },
};
