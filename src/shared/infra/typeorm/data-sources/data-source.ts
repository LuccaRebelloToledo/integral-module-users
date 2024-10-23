import 'reflect-metadata';

import { DataSource } from 'typeorm';

import env from '@shared/infra/environments/environments';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.PG_HOST,
  port: Number(env.PG_PORT),
  username: env.PG_USER,
  password: env.PG_PASS,
  database: env.PG_DB,
  useUTC: true,
  entities: [
    env.NODE_ENV === 'production'
      ? 'dist/modules/**/infra/typeorm/entities/*.entity.js'
      : 'src/modules/**/infra/typeorm/entities/*.entity.ts',
  ],
  migrations: [`${__dirname}/../migrations/*.{ts, js}`],
  migrationsRun: true,
  migrationsTransactionMode: 'all',
});

export default AppDataSource;
