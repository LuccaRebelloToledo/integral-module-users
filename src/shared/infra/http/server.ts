import { env } from '../environments/environments';

import app from './app';

import * as Sentry from '@sentry/node';
import { gracefulShutdown } from './graceful-shutdown/graceful-shutdown';

const port = env.PORT ?? 4000;

export const server = app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port} !`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received!');

  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received!');

  gracefulShutdown();
});

process.on('uncaughtException', (error) => {
  console.error(`Uncaught Exception error ${error.message} at ${new Date()} !`);
  Sentry.captureException(error);

  gracefulShutdown();
});

process.on('unhandledRejection', (error) => {
  throw error;
});
