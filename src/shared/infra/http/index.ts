import AppDataSource from '../typeorm/data-sources/data-source';

import app from './app';
import initializeServer from './server';

import gracefulShutdown from './graceful-shutdown/graceful-shutdown';

const startApp = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');

    await initializeServer(app);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message} at ${new Date()} !`);
    }

    await gracefulShutdown();
  }
};

startApp();
