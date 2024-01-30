import 'reflect-metadata';

import 'tsconfig-paths/register';

import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [
    `${__dirname}/../../../modules/**/infra/typeorm/entities/*.entity.ts`,
  ],
});
