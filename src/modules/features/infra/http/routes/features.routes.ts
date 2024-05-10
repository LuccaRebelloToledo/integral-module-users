import { Router } from 'express';

import FeaturesController from '../controllers/features.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  featurePaginationParamsSchema,
  listByKeyOrNameSchema,
} from './schemas/feature.schemas';

const featuresRouter = Router();
const featuresController = new FeaturesController();

featuresRouter.use(ensureAuthenticated);

featuresRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: featurePaginationParamsSchema,
  }),
  ensureAuthorized(['full:features', 'list:features']),
  featuresController.list,
);

featuresRouter.get(
  '/users/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-users:features']),
  featuresController.listByUserId,
);

featuresRouter.get(
  '/feature-groups/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-feature-groups:features']),
  featuresController.listByFeatureGroupId,
);

featuresRouter.get(
  '/key-or-name',
  celebrate({
    [Segments.QUERY]: listByKeyOrNameSchema,
  }),
  ensureAuthorized(['full:features', 'list-key-or-name:features']),
  featuresController.listByKeyOrName,
);

featuresRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'show:features']),
  featuresController.show,
);

export default featuresRouter;
