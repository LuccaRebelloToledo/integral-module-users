import 'dotenv/config';
import { env } from 'node:process';

export default {
  jwt: {
    secret: env.JWT_SECRET,
    accessExpiresIn: '1m',
    refreshExpiresIn: '1h',
  },
};
