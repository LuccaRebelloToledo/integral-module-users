import { env } from '@shared/infra/environments/environments';

import { AppDataSource } from '@shared/infra/typeorm/data-sources/data-source';
import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

const isTesting = env.NODE_ENV === 'test';

export const getActiveDataSource = () => {
  return isTesting ? TestAppDataSource : AppDataSource;
};
