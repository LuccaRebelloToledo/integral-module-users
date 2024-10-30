import type { Express } from 'express';

import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import 'dotenv/config';
import { env } from 'node:process';
import { environmentsSchema } from '../environments/environments';

import * as Sentry from '@sentry/node';

import gracefulShutdown from './graceful-shutdown/graceful-shutdown';

export let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const initializeServer = async (app: Express): Promise<void> => {
  await environmentsSchema.validateAsync(env);

  const PORT = env.PORT;

  server = app.listen(PORT, () => {
    console.log(`HTTP Server listening on port ${PORT} !`);
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
