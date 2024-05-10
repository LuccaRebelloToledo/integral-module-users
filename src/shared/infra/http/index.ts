import { AppDataSource } from '../typeorm/data-sources/data-source';

import app from './app';
import { initializeServer } from './server';

import { gracefulShutdown } from './graceful-shutdown/graceful-shutdown';

const startApp = async () => {
  try {
    await initializeServer(app);

    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message} at ${new Date()} !`);
    }

    await gracefulShutdown();
  }
};

startApp();
