import Joi from 'joi';

import {
  idSchema,
  listParamsSchema,
  sortSchema,
} from '@shared/infra/http/routes/schemas/global.schemas';

const nameSchema = Joi.string().trim().max(100);
const emailSchema = Joi.string().email().trim().lowercase().max(100);
const passwordSchema = Joi.string().trim();

// Sessions

export const signUpSchema = Joi.object({
  email: emailSchema.required(),
  name: nameSchema.required(),
  password: passwordSchema.required(),
}).required();

export const signInSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
}).required();

// Users

export const createUsersSchema = signUpSchema.required();

export const updateUsersSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  featureGroupId: idSchema.optional(),
});

export const listUsersParamsSchema = listParamsSchema.keys({
  sort: sortSchema.valid('email', 'name').optional(),
  name: nameSchema.optional(),
  email: emailSchema.optional(),
});
