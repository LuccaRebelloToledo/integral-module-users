import { Router } from 'express';
import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/schemas/global.schemas';
import { listByKeyOrNameSchema } from '@shared/schemas/feature-related.schemas';
import {
  createFeatureGroupsSchema,
  updateFeatureGroupsSchema,
} from '@shared/schemas/feature-group-related.schemas';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import FeatureGroupController from '../controllers/feature-group.controller';

const featureGroupsRoutes = Router();
const featureGroupController = new FeatureGroupController();

featureGroupsRoutes.use(ensureAuthenticated);

featureGroupsRoutes.get(
  '/',
  ensureAuthorized(['full:feature-groups', 'list:feature-groups']),
  featureGroupController.list,
);

featureGroupsRoutes.get(
  '/key-or-name',
  celebrate({
    [Segments.QUERY]: listByKeyOrNameSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'list-key-or-name:feature-groups']),
  featureGroupController.listByKeyOrName,
);

featureGroupsRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'show:feature-groups']),
  featureGroupController.show,
);

featureGroupsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: createFeatureGroupsSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'create:feature-groups']),
  featureGroupController.create,
);

featureGroupsRoutes.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: updateFeatureGroupsSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'update:feature-groups']),
  featureGroupController.update,
);

featureGroupsRoutes.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'delete:feature-groups']),
  featureGroupController.delete,
);

export default featureGroupsRoutes;
