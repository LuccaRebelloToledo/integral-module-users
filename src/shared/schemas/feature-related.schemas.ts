import { Joi } from 'celebrate';

export const keySchema = Joi.string().trim().max(50);
export const nameSchema = keySchema;

export const listByKeyOrNameSchema = Joi.object({
  key: keySchema.optional(),
  name: nameSchema.optional(),
});
