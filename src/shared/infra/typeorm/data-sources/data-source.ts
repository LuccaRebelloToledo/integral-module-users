import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from '@shared/infra/environments/env';

export const isProduction = env.NODE_ENV === 'production';
export const isTesting = env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.PG_HOST,
  port: Number(env.PG_PORT),
  username: env.PG_USER,
  password: env.PG_PASS,
  database: env.PG_DB,
  useUTC: true,
  cache: {
    type: 'ioredis',
    options: {
      host: env.REDIS_HOST,
      port: Number(env.REDIS_PORT),
    },
    alwaysEnabled: true,
  },
  entities: [
    isProduction
      ? `${__dirname}/../../../../dist/modules/**/infra/typeorm/entities/*.entity.js`
      : `${__dirname}/../../../../src/modules/**/infra/typeorm/entities/*.entity.ts`,
  ],
  migrations: [
    isProduction
      ? `${__dirname}/../typeorm/migrations/*.js`
      : `${__dirname}/../typeorm/migrations/*.ts`,
  ],
});
