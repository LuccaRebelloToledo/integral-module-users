import { Router } from 'express';
import { Segments, celebrate } from 'celebrate';

import {
  createUsersSchema,
  updateUsersSchema,
} from '@shared/schemas/user-related.schemas';
import { idParamSchema } from '@shared/schemas/global.schemas';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import UserController from '../controllers/user.controller';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(ensureAuthenticated);

userRoutes.get(
  '/',
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
