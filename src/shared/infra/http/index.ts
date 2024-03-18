import { AppDataSource } from '../typeorm/data-sources/data-source';

import { gracefulShutdown } from './graceful-shutdown/graceful-shutdown';

import './server';

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((error) => {
    console.error(`Database connection failed! ${error.message}`);

    gracefulShutdown();
  });
