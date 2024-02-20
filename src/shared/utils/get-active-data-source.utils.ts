import {
  isTesting,
  AppDataSource,
} from '@shared/infra/typeorm/data-sources/data-source';
import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

export const getActiveDataSource = () => {
  return isTesting ? TestAppDataSource : AppDataSource;
};
