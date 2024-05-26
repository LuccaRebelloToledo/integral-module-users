import { Joi } from 'celebrate';

import {
  listParamsSchema,
  sortSchema,
} from '@shared/infra/http/routes/schemas/global.schemas';

export const keySchema = Joi.string().trim().lowercase().max(50);
export const nameSchema = keySchema;

export const listFeaturesParamsSchema = listParamsSchema.keys({
  sort: sortSchema.valid('key', 'name').optional(),
  key: keySchema.optional(),
  name: nameSchema.optional(),
});
