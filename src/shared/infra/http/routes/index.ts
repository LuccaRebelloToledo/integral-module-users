import { Router } from 'express';

import featuresRoutes from '@modules/features/infra/http/routes/feature.routes';
import featureGroupsRoutes from '@modules/features/infra/http/routes/feature-group.routes';
import userRoutes from '@modules/users/infra/http/routes/user.routes';
import sessionRoutes from '@modules/users/infra/http/routes/session.routes';

import AppError from '@shared/errors/app-error';
import { NOT_FOUND } from '../constants/http-status-code.constants';

const routes = Router();

routes.use('/features', featuresRoutes);
routes.use('/feature-groups', featureGroupsRoutes);
routes.use('/users', userRoutes);
routes.use('/sessions', sessionRoutes);

routes.all('*', async () => {
  throw new AppError(
    'Route not defined. Please check the URL and try again.',
    NOT_FOUND,
  );
});

export default routes;
