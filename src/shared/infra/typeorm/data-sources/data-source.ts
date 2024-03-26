import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from '@shared/infra/environments/env';

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
  entities: [`./**/modules/**/infra/typeorm/entities/*.entity.{ts, js}`],
  migrations: [`${__dirname}/../migrations/*.{ts, js}`],
  migrationsRun: true,
});
