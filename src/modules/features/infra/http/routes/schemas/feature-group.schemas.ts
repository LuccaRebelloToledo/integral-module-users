import { Joi } from 'celebrate';

import { idSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  keySchema,
  nameSchema,
  listFeaturesParamsSchema,
} from './feature.schemas';

export const featureIdsSchema = Joi.array().items(idSchema.required()).unique();

export const createFeatureGroupsSchema = Joi.object({
  key: keySchema.required(),
  name: nameSchema.required(),
  featureIds: featureIdsSchema.required(),
}).required();

export const updateFeatureGroupsSchema = Joi.object({
  key: keySchema.optional(),
  name: nameSchema.optional(),
  featureIds: featureIdsSchema.optional(),
}).required();

export const listFeatureGroupsParamsSchema = listFeaturesParamsSchema;
