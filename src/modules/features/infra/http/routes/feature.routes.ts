import { Router } from 'express';
import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/schemas/global.schemas';
import { listByKeyOrNameSchema } from '@shared/schemas/feature-related.schemas';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import FeatureController from '../controllers/feature.controller';

const featuresRoutes = Router();
const featureController = new FeatureController();

featuresRoutes.use(ensureAuthenticated);

featuresRoutes.get(
  '/',
  ensureAuthorized(['full:features', 'list:features']),
  featureController.list,
);

featuresRoutes.get(
  '/:id/users',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-users:features']),
  featureController.listByUserId,
);

featuresRoutes.get(
  '/:id/feature-groups',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-feature-groups:features']),
  featureController.listByFeatureGroupId,
);

featuresRoutes.get(
  '/key-or-name',
  celebrate({
    [Segments.BODY]: listByKeyOrNameSchema,
  }),
  ensureAuthorized(['full:features', 'list-key-or-name:features']),
  featureController.listByKeyOrName,
);

featuresRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'show:features']),
  featureController.show,
);

export default featuresRoutes;
