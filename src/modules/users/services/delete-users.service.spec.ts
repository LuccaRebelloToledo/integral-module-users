import { TestAppDataSource } from '@shared/infra/typeorm/data-sources/test-data-source';

import UsersRepository from '../infra/typeorm/repositories/users.repository';
import FeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository';

import DeleteUsersService from './delete-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let usersRepository: UsersRepository;
let featureGroupRepository: FeatureGroupRepository;
let deleteUsersService: DeleteUsersService;

describe('DeleteUsersService', () => {
  beforeAll(async () => {
    await TestAppDataSource.initialize();

    usersRepository = new UsersRepository();
    featureGroupRepository = new FeatureGroupRepository();
    deleteUsersService = new DeleteUsersService(usersRepository);

    await featureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await usersRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });

    container.reset();

    container.register('UsersRepository', {
      useValue: usersRepository,
    });
  });

  afterAll(async () => {
    await TestAppDataSource.destroy();
  });

  test('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(featureGroupRepository).toBeDefined();
    expect(deleteUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userPayload = {
      id: 'non-existing-user-id',
    };

    jest.spyOn(usersRepository, 'findById');

    await expect(deleteUsersService.execute(userPayload.id)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(usersRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be delete a user', async () => {
    const userPayload = {
      id: '1',
    };

    jest.spyOn(usersRepository, 'findById');
    jest.spyOn(usersRepository, 'delete');

    await deleteUsersService.execute(userPayload.id);

    expect(usersRepository.delete).toHaveBeenCalledTimes(1);

    expect(usersRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(usersRepository.findById).toHaveBeenCalledTimes(1);

    const user = await usersRepository.findById(userPayload.id);

    expect(user).toBeNull();
  });
});
