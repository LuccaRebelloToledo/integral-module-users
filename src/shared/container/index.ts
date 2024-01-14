import { container } from 'tsyringe';

import UserRepositoryInterface from '@modules/users/repositories/user.repository.interface';
import UserRepository from '@modules/users/infra/typeorm/repositories/user.repository';

import HashProviderInterface from '@modules/users/providers/hash-provider/models/hash.provider.interface';
import BCryptHashProvider from '@modules/users/providers/hash-provider/implementations/bcrypt-hash.provider';

container.registerSingleton<UserRepositoryInterface>(
  'UserRepository',
  UserRepository
);

container.registerSingleton<HashProviderInterface>(
  'BCryptHashProvider',
  BCryptHashProvider
);
