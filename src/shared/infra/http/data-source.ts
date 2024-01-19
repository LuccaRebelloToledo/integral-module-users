import 'reflect-metadata';
import 'tsconfig-paths/register';

import { env } from './env';
import { DataSource } from 'typeorm';

export const isProduction = env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.PG_HOST,
  port: Number(env.PG_PORT),
  username: env.PG_USER,
  password: env.PG_PASS,
  database: env.PG_DB,
  entities: [
    isProduction
      ? `${__dirname}/../../../modules/**/infra/typeorm/entities/*.entity.js`
      : `${__dirname}/../../../modules/**/infra/typeorm/entities/*.entity.ts`,
  ],
  migrations: [
    isProduction
      ? `${__dirname}/../typeorm/migrations/*.js`
      : `${__dirname}/../typeorm/migrations/*.ts`,
  ],
});
