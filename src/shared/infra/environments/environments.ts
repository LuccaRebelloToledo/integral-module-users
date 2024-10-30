import Joi from 'joi';

export const environmentsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  JWT_SECRET: Joi.string().required(),
  DSN: Joi.string().uri().required(),
  PORT: Joi.number().integer().positive().required(),
  PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().integer().positive().required(),
  PG_USER: Joi.string().required(),
  PG_PASS: Joi.string().required(),
  PG_DB: Joi.string().required(),
}).unknown(true);
