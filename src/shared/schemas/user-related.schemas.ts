import Joi from 'joi';

import { idSchema } from './global.schemas';

import { featureIdsSchema } from './feature-group-related.schemas';

const nameSchema = Joi.string().trim().max(100);
const emailSchema = Joi.string().email().trim().lowercase().max(100);
const passwordSchema = Joi.string().trim();

//Sessions

export const signUpSchema = Joi.object({
  email: emailSchema.required(),
  name: nameSchema.required(),
  password: passwordSchema.required(),
});

export const signInSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
});

// Users

export const createUsersSchema = signUpSchema.keys({
  featureGroupId: idSchema.required(),
});

export const updateUsersSchema = Joi.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  featureGroupId: idSchema.optional(),
  featureIds: featureIdsSchema.optional(),
});
