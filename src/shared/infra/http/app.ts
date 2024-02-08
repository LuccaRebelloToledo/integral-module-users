import '@shared/container';

import express from 'express';
import 'express-async-errors';

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

import compression from 'compression';
import helmet from 'helmet';

import cors from 'cors';
import { corsConfig } from '@config/cors.config';

import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@config/swagger.json';

import routes from './routes';

import globalErrorHandler from './middlewares/global-error-handler.middleware';

import { env } from './env';

const app = express();

Sentry.init({
  dsn: env.DSN,
  environment: env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.use(compression());
app.use(
  helmet({
    hidePoweredBy: true,
  }),
);
app.use(cors(corsConfig));
app.use(cookieParser());

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(globalErrorHandler);

export default app;
