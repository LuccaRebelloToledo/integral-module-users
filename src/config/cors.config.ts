import env from '@shared/infra/environments/environments';

import type { CorsOptions } from 'cors';

const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export default corsConfig;
