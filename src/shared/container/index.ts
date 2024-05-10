import { container } from 'tsyringe';

import UsersRepositoryInterface from '@modules/users/repositories/users.repository.interface';
import UsersRepository from '@modules/users/infra/typeorm/repositories/users.repository';

import HashProviderInterface from '@modules/users/providers/hash-provider/models/hash.provider.interface';
import BCryptHashProvider from '@modules/users/providers/hash-provider/implementations/bcrypt-hash.provider';

import FeatureRepositoryInterface from '@modules/features/repositories/feature.repository.interface';
import FeatureRepository from '@modules/features/infra/typeorm/repositories/feature.repository';

import FeatureGroupRepositoryInterface from '@modules/features/repositories/feature-group.repository.interface';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';

container.registerSingleton<UsersRepositoryInterface>(
  'UsersRepository',
  UsersRepository,
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
