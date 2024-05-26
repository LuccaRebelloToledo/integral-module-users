import { Router } from 'express';

import UsersController from '../controllers/users.controller';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';
import ensureAuthorized from '@shared/infra/http/middlewares/ensure-authorized.middleware';

import { Segments, celebrate } from 'celebrate';

import { idParamSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  listUsersParamsSchema,
  createUsersSchema,
  updateUsersSchema,
} from './schemas/user.schemas';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.use(ensureAuthenticated);

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: listUsersParamsSchema,
  }),
  ensureAuthorized(['full:users', 'list:users']),
  usersController.list,
);

usersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:users', 'show:users']),
  usersController.show,
);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: createUsersSchema,
  }),
  ensureAuthorized(['full:users', 'create:users']),
  usersController.create,
);

usersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
    [Segments.BODY]: updateUsersSchema,
  }),
  ensureAuthorized(['full:users', 'update:users']),
  usersController.update,
);

usersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: idParamSchema,
  }),
  ensureAuthorized(['full:users', 'delete:users']),
  usersController.delete,
);

export default usersRouter;
