import { Joi } from 'celebrate';

// GLOBAL NANOID SCHEMA

export const idSchema = Joi.string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{21}$/);

// GLOBAL ID SCHEMA

export const idParamSchema = Joi.object({
  id: idSchema.required(),
});
