import Joi from 'joi';

const stringSchema = Joi.string().trim();
const portSchema = Joi.number().port();

export const environmentsSchema = Joi.object({
  NODE_ENV: stringSchema.valid('production', 'development', 'test').required(),
  JWT_SECRET: stringSchema.required(),
  JWT_ACCESS_EXPIRATION: stringSchema.required(),
  JWT_REFRESH_EXPIRATION: stringSchema.required(),
  DSN: stringSchema.uri().required(),
  PORT: portSchema.required(),
  PG_HOST: stringSchema.required(),
  PG_PORT: portSchema.required(),
  PG_USER: stringSchema.required(),
  PG_PASS: stringSchema.required(),
  PG_DB: stringSchema.required(),
}).unknown(true);
