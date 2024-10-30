import 'dotenv/config';
import { env } from 'node:process';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    accessExpiresIn: '5m',
    refreshExpiresIn: '1h',
  },
};
