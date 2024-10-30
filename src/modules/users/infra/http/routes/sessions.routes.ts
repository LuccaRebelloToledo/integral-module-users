import { Router } from 'express';

import SessionsController from '../controllers/sessions.controller';

import { Segments, celebrate } from 'celebrate';

import {
  refreshTokenSchema,
  signInSchema,
  signUpSchema,
} from './schemas/user.schemas';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/sign-up',
  celebrate({
    [Segments.BODY]: signUpSchema,
  }),
  sessionsController.signUp,
);

sessionsRouter.post(
  '/sign-in',
  celebrate({
    [Segments.BODY]: signInSchema,
  }),
  sessionsController.signIn,
);

sessionsRouter.post(
  '/refresh-token',
  celebrate({
    [Segments.BODY]: refreshTokenSchema,
  }),
  sessionsController.refreshToken,
);

export default sessionsRouter;
