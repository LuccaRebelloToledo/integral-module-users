import { container } from 'tsyringe';

import type IFeaturesRepository from '@modules/features/repositories/features.repository.interface';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';

import type IFeatureGroupsRepository from '@modules/features/repositories/feature-groups.repository.interface';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import type IHashProvider from '@modules/users/providers/hash-provider/models/hash.provider.interface';
import HashProvider from '@modules/users/providers/hash-provider/implementations/bcrypt-hash.provider';

import type IUsersRepository from '@modules/users/repositories/users.repository.interface';
import UsersRepository from '@modules/users/infra/typeorm/repositories/users.repository';

container.registerSingleton<IFeaturesRepository>(
  'FeaturesRepository',
  FeaturesRepository,
);

container.registerSingleton<IFeatureGroupsRepository>(
  'FeatureGroupsRepository',
  FeatureGroupsRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', HashProvider);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
