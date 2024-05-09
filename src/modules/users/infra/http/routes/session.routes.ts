import { Router } from 'express';

import SessionController from '../controllers/session.controller';

import { Segments, celebrate } from 'celebrate';

import { signUpSchema, signInSchema } from './schemas/user.schemas';

const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post(
  '/sign-up',
  celebrate({
    [Segments.BODY]: signUpSchema,
  }),
  sessionController.signUp,
);

sessionRoutes.post(
  '/sign-in',
  celebrate({
    [Segments.BODY]: signInSchema,
  }),
  sessionController.signIn,
);

export default sessionRoutes;
