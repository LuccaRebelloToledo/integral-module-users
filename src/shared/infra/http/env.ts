import 'dotenv/config';

import { Joi } from 'celebrate';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('test', 'development', 'production').required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  PORT: Joi.string().required(),
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.string().required(),
  PG_USER: Joi.string().required(),
  PG_PASS: Joi.string().required(),
  PG_DB: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
});

const { error, value: envVars } = envSchema.validate(process.env, {
  allowUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars;
