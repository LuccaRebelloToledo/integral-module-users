import { Router } from 'express';

import FeatureGroupsController from '../controllers/feature-groups.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  listFeatureGroupsParamsSchema,
  createFeatureGroupsSchema,
  updateFeatureGroupsSchema,
} from './schemas/feature-group.schemas';

const featureGroupsRouter = Router();
const featureGroupsController = new FeatureGroupsController();

featureGroupsRouter.use(ensureAuthenticated);

featureGroupsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: listFeatureGroupsParamsSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'list:feature-groups']),
  featureGroupsController.list,
);

featureGroupsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'show:feature-groups']),
  featureGroupsController.show,
);

featureGroupsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: createFeatureGroupsSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'create:feature-groups']),
  featureGroupsController.create,
);

featureGroupsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: updateFeatureGroupsSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'update:feature-groups']),
  featureGroupsController.update,
);

featureGroupsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:feature-groups', 'delete:feature-groups']),
  featureGroupsController.delete,
);

export default featureGroupsRouter;
