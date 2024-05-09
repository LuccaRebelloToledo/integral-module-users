import { env } from '@shared/infra/environments/environments';

import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization'],
};
