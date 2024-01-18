import { container, inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';
import User from '../infra/typeorm/entities/user.entity';

import generateNanoId from '@shared/utils/generate-nanoid.utils';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import ListFeatureGroupsService from '@modules/features/services/list-feature-groups.service';

interface CreateUsersServiceDTO {
  email: string;
  password: string;
  name: string;
  featureGroupId?: string;
}

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,

    @inject('BCryptHashProvider')
    private bcryptHashProvider: HashProviderInterface,
  ) {}

  public async execute({
    name,
    email,
    password,
    featureGroupId,
  }: CreateUsersServiceDTO): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
    }

    if (featureGroupId) {
      const listFeatureGroupsService = container.resolve(
        ListFeatureGroupsService,
      );

      await listFeatureGroupsService.execute(featureGroupId);
    }

    const generatedNanoId = generateNanoId();
    const encryptedPassword = await this.bcryptHashProvider.generateHash(
      password,
    );

    const createdUser = await this.userRepository.create({
      id: generatedNanoId,
      name,
      email,
      password: encryptedPassword,
      featureGroupId: featureGroupId ? featureGroupId : 'TO DO BETTER',
    });

    return createdUser;
  }
}
