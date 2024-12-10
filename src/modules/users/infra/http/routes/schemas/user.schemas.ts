import Joi from 'joi';

import {
  idSchema,
  listParamsSchema,
  stringSchema,
} from '@shared/infra/http/routes/schemas/global.schemas';

const nameSchema = stringSchema.max(100);
const emailSchema = stringSchema.email().lowercase().max(100);
const passwordSchema = stringSchema;
const tokenSchema = stringSchema;

// Sessions

export const signUpSchema = Joi.object({
  email: emailSchema.required(),
  name: nameSchema.required(),
  password: passwordSchema.required(),
});

export const signInSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: tokenSchema.required(),
});

// Users

export const createUsersSchema = signUpSchema.required();

export const updateUsersSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema,
  password: passwordSchema,
  featureGroupId: idSchema,
});

export const listUsersParamsSchema = listParamsSchema.keys({
  name: nameSchema,
  email: emailSchema,
});
