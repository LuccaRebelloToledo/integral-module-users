import { Router } from 'express';

import FeatureController from '../controllers/feature.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  featurePaginationParamsSchema,
  listByKeyOrNameSchema,
} from './schemas/feature.schemas';

const featuresRoutes = Router();
const featureController = new FeatureController();

featuresRoutes.use(ensureAuthenticated);

featuresRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: featurePaginationParamsSchema,
  }),
  ensureAuthorized(['full:features', 'list:features']),
  featureController.list,
);

featuresRoutes.get(
  '/users/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-users:features']),
  featureController.listByUserId,
);

featuresRoutes.get(
  '/feature-groups/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:features', 'list-feature-groups:features']),
  featureController.listByFeatureGroupId,
);

featuresRoutes.get(
  '/key-or-name',
  celebrate({
    [Segments.QUERY]: listByKeyOrNameSchema,
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
