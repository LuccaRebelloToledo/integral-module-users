import { Joi } from 'celebrate';

// GLOBAL TYPE SCHEMA

export const stringSchema = Joi.string().trim();

// GLOBAL NANOID SCHEMA

export const idSchema = stringSchema.regex(/^[A-Za-z0-9_-]{21}$/);

// GLOBAL ID PARAM SCHEMA

export const idParamSchema = Joi.object({
  id: idSchema.required(),
});

// GLOBAL PAGINATION PARAMS SCHEMA

const pageSchema = Joi.number().integer().positive().min(1).default(1);

const limitSchema = Joi.number().integer().positive().min(1).default(10);

export const sortSchema = stringSchema
  .valid('createdAt', 'updatedAt', 'deletedAt')
  .default('createdAt');

const orderSchema = stringSchema
  .uppercase()
  .valid('ASC', 'DESC')
  .default('DESC');

export const listParamsSchema = Joi.object({
  page: pageSchema,
  limit: limitSchema,
  sort: sortSchema,
  order: orderSchema,
});
