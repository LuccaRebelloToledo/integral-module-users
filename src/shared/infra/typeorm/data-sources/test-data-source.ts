import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const TestAppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [
    `${__dirname}/../../../../modules/**/infra/typeorm/entities/*.entity.ts`,
  ],
});
