import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensure-authenticated.middleware';

import UserController from '../controllers/user.controller';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/', ensureAuthenticated, userController.show);

userRoutes.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  ensureAuthenticated,
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
  ensureAuthenticated,
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
  ensureAuthenticated,
  userController.update,
);

userRoutes.delete(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  ensureAuthenticated,
  userController.delete,
);

export default userRoutes;
