import { Router } from 'express';
import { Segments, celebrate } from 'celebrate';
import {
  signInSchema,
  signUpSchema,
} from '@shared/schemas/user-related.schemas';

import SessionController from '../controllers/session.controller';

const sessionRoutes = Router();
const sessionController = new SessionController();

/**
 * @openapi
 * /sessions/sign-up:
 *  post:
 *   tags:
 *    - Sessions
 *   description: This endpoint allows a new user to sign up for an account.
 *   requestBody:
 *    required: true
 *    description: The required data for a new user to sign up.
 *    content:
 *      'application/json':
 *        schema:
 *          $ref: '#/components/schemas/SignUpSchema'
 *   responses:
 *     '204':
 *      description: The account has been successfully created for the new user.
 *     '409':
 *      description: The request could not be completed because the email provided is already associated with an existing account.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EmailAlreadyInUseSchema'
 *     '500':
 *      description: An unexpected error occurred on the server while processing the request.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InternalServerErrorSchema'
 */
sessionRoutes.post(
  '/sign-up',
  celebrate({
    [Segments.BODY]: signUpSchema,
  }),
  sessionController.signUp,
);

/**
 * @openapi
 * /sessions/sign-in:
 *  post:
 *   tags:
 *    - Sessions
 *   description: This endpoint is used for user authentication. It allows a user to sign in to their account using their credentials.
 *   requestBody:
 *    required: true
 *    description: The user needs to provide the necessary credentials (usually email and password) to sign in.
 *    content:
 *      'application/json':
 *        schema:
 *          $ref: '#/components/schemas/SignInSchema'
 *   responses:
 *     '204':
 *      description: The request was successful and a token has been provided for the user's session.
 *     '401':
 *      description: The user's credentials are not recognized or are incorrect.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InvalidCredentialsSchema'
 *     '403':
 *      description: The user is not associated with any feature group.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MissingUserFeatureGroupSchema'
 *     '404':
 *      description: The user is not associated with any feature.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FeatureNotFoundSchema'
 *     '500':
 *      description: An unexpected error occurred on the server while processing the request.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InternalServerErrorSchema'
 */
sessionRoutes.post(
  '/sign-in',
  celebrate({
    [Segments.BODY]: signInSchema,
  }),
  sessionController.signIn,
);

export default sessionRoutes;
