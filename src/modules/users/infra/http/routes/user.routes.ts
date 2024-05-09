import { Router } from 'express';

import UserController from '../controllers/user.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  userPaginationParamsSchema,
  createUsersSchema,
  updateUsersSchema,
} from './schemas/user.schemas';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(ensureAuthenticated);

userRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: userPaginationParamsSchema,
  }),
  ensureAuthorized(['full:users', 'list:users']),
  userController.list,
);

userRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:users', 'show:users']),
  userController.show,
);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: createUsersSchema,
  }),
  ensureAuthorized(['full:users', 'create:users']),
  userController.create,
);

userRoutes.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: updateUsersSchema,
  }),
  ensureAuthorized(['full:users', 'update:users']),
  userController.update,
);

userRoutes.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:users', 'delete:users']),
  userController.delete,
);

export default userRoutes;
