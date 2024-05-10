import { Express } from 'express';

import { Server, IncomingMessage, ServerResponse } from 'node:http';

import { env } from '../environments/environments';

import * as Sentry from '@sentry/node';

import { gracefulShutdown } from './graceful-shutdown/graceful-shutdown';

const port: number = env.PORT ?? 4000;
export let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const initializeServer = async (app: Express): Promise<void> => {
  server = app.listen(port, () => {
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
    console.error(
      `Uncaught Exception error ${error.message} at ${new Date()} !`,
    );
    Sentry.captureException(error);

    gracefulShutdown();
  });

  process.on('unhandledRejection', (error) => {
    throw error;
  });
};

export default initializeServer;
