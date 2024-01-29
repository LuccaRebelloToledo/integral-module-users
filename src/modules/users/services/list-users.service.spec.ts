import AppErrorTypes from '@shared/errors/app-error-types';
import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';

import ListUsersService from './list-users.service';

import AppError from '@shared/errors/app-error';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

let fakeUserRepository: FakeUserRepository;
let listUsersService: ListUsersService;

describe('ListUsersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    listUsersService = new ListUsersService(fakeUserRepository);
  });

  it('should throw an error when there are no users', async () => {
    await expect(listUsersService.execute()).rejects.toEqual(
      new AppError(AppErrorTypes.users.notFound, NOT_FOUND),
    );
  });

  it('should be able to list all users', async () => {
    const userOne = await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '1',
    });

    const userTwo = await fakeUserRepository.create({
      id: '2',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '2',
    });

    const users = await listUsersService.execute();
    expect(users).toEqual([userOne, userTwo]);
  });
});
