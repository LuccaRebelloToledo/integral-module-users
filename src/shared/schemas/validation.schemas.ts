import Joi from 'joi';

export const idSchema = Joi.string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{21}$/)
  .required();

export const signUpSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().max(100).required(),
  name: Joi.string().trim().max(100).required(),
  password: Joi.string().trim().required(),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().max(100).required(),
  password: Joi.string().trim().required(),
});
