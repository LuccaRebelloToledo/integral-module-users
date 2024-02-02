import { TestAppDataSource } from '@shared/infra/http/data-source';

import UserRepository from '../infra/typeorm/repositories/user.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';

import DeleteUsersService from './delete-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let userRepository: UserRepository;
let featureGroupRepository: FeatureGroupRepository;
let deleteUsersService: DeleteUsersService;

describe('DeleteUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    userRepository = new UserRepository();
    featureGroupRepository = new FeatureGroupRepository();
    deleteUsersService = new DeleteUsersService(userRepository);

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await userRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    container.reset();

    container.register('UserRepository', {
      useValue: userRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(deleteUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userPayload = {
      id: 'non-existing-user-id',
    };

    jest.spyOn(userRepository, 'findById');

    await expect(deleteUsersService.execute(userPayload.id)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be delete a user', async () => {
    const userPayload = {
      id: '1',
    };

    jest.spyOn(userRepository, 'findById');
    jest.spyOn(userRepository, 'delete');

    await deleteUsersService.execute(userPayload.id);

    expect(userRepository.delete).toHaveBeenCalledTimes(1);

    expect(userRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(userRepository.findById).toHaveBeenCalledTimes(1);

    const user = await userRepository.findById(userPayload.id);

    expect(user).toBeNull();
  });
});
