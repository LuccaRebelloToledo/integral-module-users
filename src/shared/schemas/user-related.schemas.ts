import Joi from 'joi';

import { idSchema } from './global.schemas';

const nameSchema = Joi.string().trim().max(100);
const emailSchema = Joi.string().email().trim().lowercase().max(100);
const passwordSchema = Joi.string().trim();
const featureIdsSchema = Joi.array().items(idSchema.required()).unique();

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

export const createUsersSchema = Joi.object({
  signUpSchema,
  featureGroupId: idSchema.required(),
});

export const updateUsersSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  featureGroupId: idSchema,
  featureIds: featureIdsSchema,
});
