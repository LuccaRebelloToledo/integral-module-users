import FakeUserRepository from '../infra/typeorm/repositories/user.fake.repository';

import ListUsersService from './list-users.service';

import AppError from '@shared/errors/app-error';

let fakeUserRepository: FakeUserRepository;
let listUsersService: ListUsersService;

describe('ListUsersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    listUsersService = new ListUsersService(fakeUserRepository);
  });

  it('should throw an error when there are no users', async () => {
    await expect(listUsersService.execute()).rejects.toThrow(AppError);
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
