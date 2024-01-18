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

userRoutes.get('/', ensureAuthorized(['test']), userController.show);

userRoutes.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  userController.index,
);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: createUsersSchema,
  }),
  userController.create,
);

userRoutes.put(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: updateUsersSchema,
  }),
  userController.update,
);

userRoutes.delete(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  userController.delete,
);

export default userRoutes;
