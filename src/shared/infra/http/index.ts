import { AppDataSource } from './data-source';
import '@shared/container';

import express from 'express';
import 'express-async-errors';

import sessionConfig from '@config/session.config';

import routes from './routes';

import AppError from '@shared/errors/app-error';
import globalErrorHandler from './middlewares/global-error-handler.middleware';

AppDataSource.initialize().then(async () => {
  console.log('🚀 Database connected');

  const app = express();

  app.use(express.json());

  app.use(sessionConfig);

  app.use('/api', routes);
  app.all('*', async (_req, _res, _next) => {
    throw new AppError('Something is wrong');
  });

  app.use(globalErrorHandler);

  app.listen({
    port: process.env.PORT ?? 4000,
  });

  console.log(`🚀 HTTP Server listening on port ${process.env.PORT}`);
});
