import { container } from 'tsyringe';

import FeaturesRepositoryInterface from '@modules/features/repositories/features.repository.interface';
import FeaturesRepository from '@modules/features/infra/typeorm/repositories/features.repository';

import FeatureGroupsRepositoryInterface from '@modules/features/repositories/feature-groups.repository.interface';
import FeatureGroupsRepository from '@modules/features/infra/typeorm/repositories/feature-groups.repository';

import HashProviderInterface from '@modules/users/providers/hash-provider/models/hash.provider.interface';
import BCryptHashProvider from '@modules/users/providers/hash-provider/implementations/bcrypt-hash.provider';

import UsersRepositoryInterface from '@modules/users/repositories/users.repository.interface';
import UsersRepository from '@modules/users/infra/typeorm/repositories/users.repository';

container.registerSingleton<FeaturesRepositoryInterface>(
  'FeaturesRepository',
  FeaturesRepository,
);

container.registerSingleton<FeatureGroupsRepositoryInterface>(
  'FeatureGroupsRepository',
  FeatureGroupsRepository,
);

container.registerSingleton<HashProviderInterface>(
  'BCryptHashProvider',
  BCryptHashProvider,
);

container.registerSingleton<UsersRepositoryInterface>(
  'UsersRepository',
  UsersRepository,
);
