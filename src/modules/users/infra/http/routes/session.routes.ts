import { Router } from 'express';
import { Segments, celebrate } from 'celebrate';
import {
  signInSchema,
  signUpSchema,
} from '@shared/schemas/user-related.schemas';

import SessionController from '../controllers/session.controller';

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
