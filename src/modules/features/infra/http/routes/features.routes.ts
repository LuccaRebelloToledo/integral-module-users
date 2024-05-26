import { Router } from 'express';

import FeaturesController from '../controllers/features.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { listFeaturesParamsSchema } from './schemas/feature.schemas';

const featuresRouter = Router();
const featuresController = new FeaturesController();

featuresRouter.use(ensureAuthenticated);

featuresRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: listFeaturesParamsSchema,
  }),
  ensureAuthorized(['list:features']),
  featuresController.list,
);

export default featuresRouter;
