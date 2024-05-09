import { env } from '@shared/infra/environments/environments';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRATION,
  },
};
