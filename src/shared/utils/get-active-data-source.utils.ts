import { AppDataSource, isTesting } from '@shared/infra/http/data-source';

import { TestAppDataSource } from '@shared/infra/http/test-data-source';

export const getActiveDataSource = () => {
  return isTesting ? TestAppDataSource : AppDataSource;
};
