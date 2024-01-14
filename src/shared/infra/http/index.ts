import { AppDataSource } from './data-source';

import Express from 'express';
import 'express-async-errors';

import '@shared/container';

AppDataSource.initialize().then(async () => {
  console.log('🚀 Database connected');

  const express = Express();

  express.listen({
    port: 4000,
  });

  console.log('🚀 HTTP Server listening on port 4000');
});
