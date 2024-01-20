import { Router } from 'express';

import featuresRoutes from '@modules/features/infra/http/routes/feature.routes';
import userRoutes from '@modules/users/infra/http/routes/user.routes';
import sessionRoutes from '@modules/users/infra/http/routes/session.routes';

const routes = Router();

routes.use('/features', featuresRoutes);
routes.use('/users', userRoutes);
routes.use('/sessions', sessionRoutes);

export default routes;
