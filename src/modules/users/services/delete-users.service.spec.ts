import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';

import DeleteUsersService from './delete-users.service';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

let fakeUserRepository: FakeUserRepository;
let deleteUsersService: DeleteUsersService;

describe('DeleteUsersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    deleteUsersService = new DeleteUsersService(fakeUserRepository);
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

    await expect(deleteUsersService.execute('2')).rejects.toEqual(
      new AppError(AppErrorTypes.users.notFound, NOT_FOUND),
    );

    expect(spyFindById).toHaveBeenCalledTimes(1);
  });

  it('should be able to delete the user by id', async () => {
    const spyCreate = jest.spyOn(fakeUserRepository, 'create');

    const johnDoeOne = await fakeUserRepository.create({
      id: '1',
      name: 'John Doe',
      password: '123456',
      email: 'johndoe@gmail.com',
      featureGroupId: '1',
    });

    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.getUsersCount()).toBe(1);

    const spyFindById = jest.spyOn(fakeUserRepository, 'findById');
    const spyDelete = jest.spyOn(fakeUserRepository, 'delete');

    await deleteUsersService.execute(johnDoeOne.id);

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(fakeUserRepository.getUsersCount()).toBe(0);
  });
});
