import { env } from '@shared/infra/http/env';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRATION,
  },
};
