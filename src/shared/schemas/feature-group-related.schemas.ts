import { Joi } from 'celebrate';

import { idSchema } from './global.schemas';
import {
  featurePaginationParamsSchema,
  keySchema,
  nameSchema,
} from './feature-related.schemas';

export const featureIdsSchema = Joi.array().items(idSchema.required()).unique();

export const createFeatureGroupsSchema = Joi.object({
  key: keySchema.required(),
  name: nameSchema.required(),
  featureIds: featureIdsSchema.required(),
});

export const updateFeatureGroupsSchema = Joi.object({
  key: keySchema.optional(),
  name: nameSchema.optional(),
  featureIds: featureIdsSchema.optional(),
});

export const featureGroupPaginationParamsSchema = featurePaginationParamsSchema;
