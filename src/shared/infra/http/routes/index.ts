import { Router } from 'express';

import featuresRouter from '@modules/features/infra/http/routes/features.routes';
import featureGroupsRouter from '@modules/features/infra/http/routes/feature-groups.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';

import AppError from '@shared/errors/app-error';
import { NOT_FOUND } from '../constants/http-status-code.constants';

const routes = Router();

routes.use('/features', featuresRouter);
routes.use('/feature-groups', featureGroupsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.all('*', async () => {
  throw new AppError(
    'Route not defined. Please check the URL and try again.',
    NOT_FOUND,
  );
});

export default routes;
