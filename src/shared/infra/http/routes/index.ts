import { Router } from 'express';

import sessionRoutes from '@modules/users/infra/http/routes/session.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);

export default routes;
