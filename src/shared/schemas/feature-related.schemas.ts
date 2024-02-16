import { Joi } from 'celebrate';
import { paginationParamsSchema, sortSchema } from './global.schemas';

export const keySchema = Joi.string().trim().lowercase().max(50);
export const nameSchema = keySchema;

export const listByKeyOrNameSchema = Joi.object({
  key: keySchema.optional(),
  name: nameSchema.optional(),
});

export const featurePaginationParamsSchema = paginationParamsSchema.keys({
  sort: sortSchema.valid('key', 'name').optional(),
  key: keySchema.optional(),
  name: nameSchema.optional(),
});
