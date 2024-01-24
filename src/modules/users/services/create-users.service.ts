import { container, inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';
import HashProviderInterface from '../providers/hash-provider/models/hash.provider.interface';

import generateNanoId from '@shared/utils/generate-nanoid.utils';

import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';

interface CreateUsersServiceDTO {
  email: string;
  password: string;
  name: string;
  featureGroupId?: string;
}

const featureGroupMemberId = '6P8s76YxCtSMgmKDx49dV';

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
  }: CreateUsersServiceDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError(AppErrorTypes.users.emailAlreadyInUse);
    }

    if (featureGroupId) {
      const showFeatureGroupsService = container.resolve(
        ShowFeatureGroupsService,
      );

      await showFeatureGroupsService.execute(featureGroupId);
    }

    const generatedNanoId = generateNanoId();
    const encryptedPassword = await this.bcryptHashProvider.generateHash(
      password,
    );

    await this.userRepository.create({
      id: generatedNanoId,
      name,
      email,
      password: encryptedPassword,
      featureGroupId: featureGroupId ? featureGroupId : featureGroupMemberId,
    });
  }
}
