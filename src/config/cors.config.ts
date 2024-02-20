import { env } from '@shared/infra/environments/env';

export const corsConfig = {
  credentials: true,
  origin: env.CORS_ORIGIN ?? '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};
