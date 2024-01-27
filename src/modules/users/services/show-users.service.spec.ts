import FakeUserRepository from '../infra/typeorm/repositories/user.fake.repository';

import ShowUsersService from './show-users.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

let fakeUserRepository: FakeUserRepository;
let showUsersService: ShowUsersService;

describe('ShowUsersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    showUsersService = new ShowUsersService(fakeUserRepository);
  });

  it('should throw an error when there are no users found by id', async () => {
    const spyCreate = jest.spyOn(fakeUserRepository, 'create');

    await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '1',
    });

    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.getUsersCount()).toBe(1);

    const spyFindById = jest.spyOn(fakeUserRepository, 'findById');

    await expect(showUsersService.execute('2')).rejects.toThrow(AppError);
    await expect(showUsersService.execute('2')).rejects.toEqual(
      new AppError(AppErrorTypes.users.notFound, NOT_FOUND),
    );

    expect(spyFindById).toHaveBeenCalledTimes(2);
  });

  it('should be able to show the user by id', async () => {
    const spyCreate = jest.spyOn(fakeUserRepository, 'create');

    const johnDoeOne = await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '1',
    });

    await fakeUserRepository.create({
      id: '2',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '2',
    });

    expect(spyCreate).toHaveBeenCalledTimes(2);
    expect(fakeUserRepository.getUsersCount()).toBe(2);

    const spyFindById = jest.spyOn(fakeUserRepository, 'findById');

    const user = await showUsersService.execute(johnDoeOne.id);

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(user).toEqual(johnDoeOne);
  });
});
