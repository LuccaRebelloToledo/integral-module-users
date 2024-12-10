import Joi from 'joi';

import { stringSchema } from '../http/routes/schemas/global.schemas';

const nodeEnvSchema = stringSchema.valid('production', 'development', 'test');
const uriSchema = stringSchema.uri();
const portSchema = Joi.number().port();

export const environmentsSchema = Joi.object({
  NODE_ENV: nodeEnvSchema.required(),
  JWT_SECRET: stringSchema.required(),
  JWT_ACCESS_EXPIRATION: stringSchema.required(),
  JWT_REFRESH_EXPIRATION: stringSchema.required(),
  DSN: uriSchema.required(),
  PORT: portSchema.required(),
  PG_HOST: stringSchema.required(),
  PG_PORT: portSchema.required(),
  PG_USER: stringSchema.required(),
  PG_PASS: stringSchema.required(),
  PG_DB: stringSchema.required(),
}).unknown(true);
