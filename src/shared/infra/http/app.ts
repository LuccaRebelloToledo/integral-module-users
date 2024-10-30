import './sentry/instrument';

import '@shared/container';

import express from 'express';
import 'express-async-errors';

import * as Sentry from '@sentry/node';

import compression from 'compression';
import helmet from 'helmet';

import corsConfig from '@config/cors.config';
import cors from 'cors';

import swaggerDocument from '@config/swagger.json';
import swaggerUi from 'swagger-ui-express';

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

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

Sentry.setupExpressErrorHandler(app);

app.use(globalErrorHandler);

export default app;
