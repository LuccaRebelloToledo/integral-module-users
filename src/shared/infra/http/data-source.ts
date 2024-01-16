import 'reflect-metadata';
import 'tsconfig-paths/register';
import 'dotenv/config';

import { DataSource } from 'typeorm';

export const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
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
