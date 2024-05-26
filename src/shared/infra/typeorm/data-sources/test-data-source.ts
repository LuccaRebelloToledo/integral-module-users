import 'reflect-metadata';

import { DataSource } from 'typeorm';

const TestAppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [`./**/modules/**/infra/typeorm/entities/*.entity.{ts, js}`],
});

export default TestAppDataSource;
