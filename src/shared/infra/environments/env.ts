import dotenv from 'dotenv';

export const isTesting = process.env.NODE_ENV === 'test';

const dotenvConfigOutput = dotenv.config({
  path: isTesting ? '.env.test' : '.env',
});

import { Joi } from 'celebrate';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().required(),
  DSN: Joi.string().uri().required(),
  PORT: Joi.string().required(),
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.string().required(),
  PG_USER: Joi.string().required(),
  PG_PASS: Joi.string().required(),
  PG_DB: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
});

const { error, value: envVars } = envSchema.validate(
  dotenvConfigOutput.parsed,
  {
    allowUnknown: true,
  },
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars;
