import AppDataSource from '@shared/infra/typeorm/data-sources/data-source';

import { server } from '@shared/infra/http/server';

import * as Sentry from '@sentry/node';

import { exit } from 'node:process';

const gracefulShutdown = async () => {
  try {
    console.error('GracefulShutdown is Started!');

    server.closeIdleConnections();
    console.info('Server is closing idle connections!');

    server.close(async (err) => {
      if (err) {
        console.error(`Server is closed with error! ${err.message}`);
        Sentry.captureException(err);
        exit(1);
      }

      console.info('Server is closed!');

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();

        console.info('Database connection is closed!');
      }

      console.info('GracefulShutdown is finished!');
      exit(0);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error during graceful shutdown!', ${error.message}`);
    }

    Sentry.captureException(error);
    exit(1);
  }
};

export default gracefulShutdown;
