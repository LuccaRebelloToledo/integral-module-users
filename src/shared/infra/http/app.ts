import '@shared/container';

import express from 'express';
import 'express-async-errors';

import compression from 'compression';
import helmet from 'helmet';

import cors from 'cors';
import { corsConfig } from '@config/cors.config';

import cookieParser from 'cookie-parser';

import routes from './routes';
import globalErrorHandler from './middlewares/global-error-handler.middleware';

const app = express();

app.use(compression());
app.use(
  helmet({
    hidePoweredBy: true,
  }),
);
app.use(cors(corsConfig));
app.use(cookieParser());

app.use(express.json());

app.use(routes);

app.use(globalErrorHandler);

export default app;
