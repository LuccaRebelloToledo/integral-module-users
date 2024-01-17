import { container } from 'tsyringe';

import UserRepositoryInterface from '@modules/users/repositories/user.repository.interface';
import UserRepository from '@modules/users/infra/typeorm/repositories/user.repository';

import HashProviderInterface from '@modules/users/providers/hash-provider/models/hash.provider.interface';
import BCryptHashProvider from '@modules/users/providers/hash-provider/implementations/bcrypt-hash.provider';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import FeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository';

import FeatureGroupRepositoryInterface from '@modules/features/repositories/feature-group.repository.interface';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';

container.registerSingleton<UserRepositoryInterface>(
  'UserRepository',
  UserRepository,
);

container.registerSingleton<HashProviderInterface>(
  'BCryptHashProvider',
  BCryptHashProvider,
);

container.registerSingleton<FeatureRepositoryInterface>(
  'FeatureRepository',
  FeatureRepository,
);

container.registerSingleton<FeatureGroupRepositoryInterface>(
  'FeatureGroupRepository',
  FeatureGroupRepository,
);
