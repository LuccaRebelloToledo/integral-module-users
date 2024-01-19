import { env } from '@shared/infra/http/env';

const corsConfig = {
  credentials: true,
  origin: env.CORS_ORIGIN ?? '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

export default corsConfig;
