import { AppDataSource } from './data-source';

import { env } from './env';

import app from './app';

AppDataSource.initialize()
  .then(() => {
    console.log('🚀 Database connected');

    const port = env.PORT ?? 4000;

    app.listen(port, () => {
      console.log(`🚀 HTTP Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('🚀 Database connection failed', error);
    process.exit(1);
  });
