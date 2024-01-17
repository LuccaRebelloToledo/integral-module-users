import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

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
    [Segments.PARAMS]: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  userController.index,
);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().max(100).required(),
      email: Joi.string().email().max(100).required(),
      password: Joi.string().required(),
    }),
  }),
  userController.create,
);

userRoutes.put(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().max(100),
      email: Joi.string().email().max(100),
      password: Joi.string(),
    }),
  }),
  userController.update,
);

userRoutes.delete(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  userController.delete,
);

export default userRoutes;
