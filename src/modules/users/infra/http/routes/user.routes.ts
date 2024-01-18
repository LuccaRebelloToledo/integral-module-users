import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';
import { idSchema, signUpSchema } from '@shared/schemas/validation.schemas';

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
      userId: idSchema,
    }),
  }),
  userController.index,
);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: signUpSchema,
  }),
  userController.create,
);

userRoutes.put(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: idSchema,
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().trim().max(100),
      email: Joi.string().email().trim().lowercase().max(100),
      password: Joi.string().trim(),
      featureGroupId: Joi.string().trim().max(21),
      featureIds: Joi.array()
        .items(Joi.string().trim().max(21).required())
        .unique(),
    }),
  }),
  userController.update,
);

userRoutes.delete(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      userId: idSchema,
    }),
  }),
  userController.delete,
);

export default userRoutes;
