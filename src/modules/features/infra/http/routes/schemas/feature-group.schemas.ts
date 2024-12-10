import { Joi } from 'celebrate';

import { idSchema } from '@shared/infra/http/routes/schemas/global.schemas';

import {
  keySchema,
  listFeaturesParamsSchema,
  nameSchema,
} from './feature.schemas';

export const featureIdsSchema = Joi.array().items(idSchema.required()).unique();

export const createFeatureGroupsSchema = Joi.object({
  key: keySchema.required(),
  name: nameSchema.required(),
  featureIds: featureIdsSchema.required(),
});

export const updateFeatureGroupsSchema = Joi.object({
  key: keySchema,
  name: nameSchema,
  featureIds: featureIdsSchema,
});

export const listFeatureGroupsParamsSchema = listFeaturesParamsSchema;
