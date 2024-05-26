import { Express } from 'express';

import { Server, IncomingMessage, ServerResponse } from 'node:http';

import env from '../environments/environments';

import * as Sentry from '@sentry/node';

import gracefulShutdown from './graceful-shutdown/graceful-shutdown';

const port = env.PORT ?? 4000;
export let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const initializeServer = async (app: Express): Promise<void> => {
  server = app.listen(port, () => {
    console.log(`HTTP Server listening on port ${port} !`);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received!');

    await gracefulShutdown();
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received!');

    await gracefulShutdown();
  });

  process.on('uncaughtException', async (error) => {
    console.error(
      `Uncaught Exception error ${error.message} at ${new Date()} !`,
    );
    Sentry.captureException(error);

    await gracefulShutdown();
  });

  process.on('unhandledRejection', (error) => {
    throw error;
  });
};

export default initializeServer;
