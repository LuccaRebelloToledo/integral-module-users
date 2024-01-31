import { TestDataSource } from '@shared/infra/http/test-data-source';

import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';

import DeleteUsersService from './delete-users.service';

import AppErrorTypes from '@shared/errors/app-error-types';

import { container } from 'tsyringe';

let fakeUserRepository: FakeUserRepository;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;
let deleteUsersService: DeleteUsersService;

describe('DeleteUsersService', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();

    fakeUserRepository = new FakeUserRepository();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();
    deleteUsersService = new DeleteUsersService(fakeUserRepository);

    container.reset();

    container.register('UserRepository', {
      useValue: fakeUserRepository,
    });

    await fakeFeatureGroupRepository.create({
      id: '1',
      key: 'feature-group-key',
      name: 'Feature Group Name',
      features: [],
    });

    await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      featureGroupId: '1',
    });
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  test('should be defined', () => {
    expect(fakeUserRepository).toBeDefined();
    expect(fakeFeatureGroupRepository).toBeDefined();
    expect(deleteUsersService).toBeDefined();
  });

  test('should throw an error if no user is found', async () => {
    const userId = 'non-existing-user-id';

    jest.spyOn(fakeUserRepository, 'findById');

    await expect(deleteUsersService.execute(userId)).rejects.toThrow(
      AppErrorTypes.users.notFound,
    );

    expect(fakeUserRepository.findById).toHaveBeenCalledWith(userId);

    expect(fakeUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should be delete a user', async () => {
    const userPayload = {
      id: '1',
    };

    jest.spyOn(fakeUserRepository, 'findById');
    jest.spyOn(fakeUserRepository, 'delete');

    await deleteUsersService.execute(userPayload.id);

    expect(fakeUserRepository.findById).toHaveBeenCalledWith(userPayload.id);

    expect(fakeUserRepository.findById).toHaveBeenCalledTimes(1);

    expect(fakeUserRepository.delete).toHaveBeenCalledTimes(1);

    const user = await fakeUserRepository.findById(userPayload.id);

    expect(user).toBeNull();
  });
});
