import { env } from '@shared/infra/environments/env';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRATION,
  },
};
