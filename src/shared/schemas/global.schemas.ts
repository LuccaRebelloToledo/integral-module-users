import { Joi } from 'celebrate';

// GLOBAL NANOID SCHEMA

export const idSchema = Joi.string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{21}$/);

// GLOBAL ID PARAM SCHEMA

export const idParamSchema = Joi.object({
  id: idSchema.required(),
});

// GLOBAL PAGINATION PARAMS SCHEMA

const pageSchema = Joi.string()
  .trim()
  .regex(/^[1-9]\d*$/)
  .default('1');

const limitSchema = Joi.string()
  .trim()
  .regex(/^[1-9]\d*$/)
  .default('5');

export const sortSchema = Joi.string()
  .trim()
  .valid('createdAt', 'updatedAt')
  .default('createdAt');

const orderSchema = Joi.string()
  .trim()
  .uppercase()
  .valid('ASC', 'DESC')
  .default('DESC');

export const paginationParamsSchema = Joi.object({
  page: pageSchema,
  limit: limitSchema,
  order: orderSchema,
});
