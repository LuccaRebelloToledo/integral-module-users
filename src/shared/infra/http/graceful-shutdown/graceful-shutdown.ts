import { AppDataSource } from '@shared/infra/http/data-source';

import { server } from '@shared/infra/http/server';

import * as Sentry from '@sentry/node';

import { exit } from 'node:process';

export const gracefulShutdown = () => {
  try {
    console.error('🚀 GracefulShutdown is Started!');

    server.closeIdleConnections();
    console.info('🚀 Server is closing idle connections!');

    server.close(async (err) => {
      if (err) {
        console.error('🚀 Server is closed with error!', err);
        Sentry.captureException(err);
        exit(1);
      }
      console.info('🚀 Server is closed!');

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.info('🚀 Database connection is closed!');
        exit(0);
      }

      exit(0);
    });
  } catch (error) {
    console.error('Error during graceful shutdown!', error);

    Sentry.captureException(error);
    exit(1);
  }
};
