import 'dotenv/config';

import process from 'node:process';

import { Joi } from 'celebrate';

const environmentsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  CORS_ORIGIN: Joi.string().uri().allow('*').required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  DSN: Joi.string().uri().required(),
  PORT: Joi.number().integer().positive().required(),
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().integer().positive().required(),
  PG_USER: Joi.string().required(),
  PG_PASS: Joi.string().required(),
  PG_DB: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().integer().positive().required(),
  REDIS_PASS: Joi.string().required(),
}).required();

const { error, value: envVars } = environmentsSchema.validate(process.env, {
  allowUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars;
