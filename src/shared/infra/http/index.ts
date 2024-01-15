import { AppDataSource } from './data-source';

import Express from 'express';
import 'express-async-errors';

import '@shared/container';

import routes from './routes';

import AppError from '@shared/errors/app-error';

import globalErrorHandler from './middlewares/global-error-handler.middleware';

AppDataSource.initialize().then(async () => {
  console.log('🚀 Database connected');

  const express = Express();

  express.use('/api', routes);
  express.all('*', async (_req, _res, _next) => {
    throw new AppError('Something is wrong');
  });

  express.use(globalErrorHandler);

  express.listen({
    port: process.env.PORT ?? 4000,
  });

  console.log(`🚀 HTTP Server listening on port ${process.env.PORT}`);
});
