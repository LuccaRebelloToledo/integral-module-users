import {
  listParamsSchema,
  stringSchema,
} from '@shared/infra/http/routes/schemas/global.schemas';

export const keySchema = stringSchema.lowercase().max(50);
export const nameSchema = keySchema;

export const listFeaturesParamsSchema = listParamsSchema.keys({
  key: keySchema.optional(),
  name: nameSchema.optional(),
});
