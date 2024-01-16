import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';

import SessionController from '../controllers/session.controller';

const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post(
  '/sign-up',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required().max(100),
      name: Joi.string().required().max(100),
      password: Joi.string().required(),
    }),
  }),
  sessionController.signUp,
);

sessionRoutes.post(
  '/sign-in',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required().max(100),
      password: Joi.string().required(),
    }),
  }),
  sessionController.signIn,
);

export default sessionRoutes;
