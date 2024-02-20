import { env } from '../environments/env';

import app from './app';
import { gracefulShutdown } from './graceful-shutdown/graceful-shutdown';

const port = env.PORT ?? 4000;

export const server = app.listen(port, () => {
  console.log(`🚀 HTTP Server listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('🚀 SIGTERM signal received');

  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('🚀 SIGINT signal received');

  gracefulShutdown();
});
