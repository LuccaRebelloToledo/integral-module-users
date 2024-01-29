import FakeFeatureGroupRepository from '@modules/features/infra/typeorm/repositories/feature-group.repository.fake';
import FakeUserRepository from '../infra/typeorm/repositories/user.repository.fake';
import FakeBCryptHashProvider from '../providers/hash-provider/implementations/bcrypt-hash.provider.fake';

import CreateUsersService from './create-users.service';
import ShowFeatureGroupsService from '@modules/features/services/show-feature-groups.service';

import { container } from 'tsyringe';

import AppError from '@shared/errors/app-error';
import AppErrorTypes from '@shared/errors/app-error-types';
import { NOT_FOUND } from '@shared/infra/http/constants/http-status-code.constants';

let fakeUserRepository: FakeUserRepository;
let fakeBCryptHashProvider: FakeBCryptHashProvider;
let fakeFeatureGroupRepository: FakeFeatureGroupRepository;

let createUsersService: CreateUsersService;
let showFeatureGroupsService: ShowFeatureGroupsService;

describe('CreateUsersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeBCryptHashProvider = new FakeBCryptHashProvider();
    fakeFeatureGroupRepository = new FakeFeatureGroupRepository();

    createUsersService = new CreateUsersService(
      fakeUserRepository,
      fakeBCryptHashProvider,
    );

    showFeatureGroupsService = new ShowFeatureGroupsService(
      fakeFeatureGroupRepository,
    );
  });

  it('should throw an error when a user is found by email', async () => {
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

    const newUser = {
      email: 'johndoe@gmail.com',
      password: '123456',
      name: 'John Doe',
      featureGroupId: '1',
    };

    const spyFindByEmail = jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(createUsersService.execute(newUser)).rejects.toEqual(
      new AppError(AppErrorTypes.users.emailAlreadyInUse),
    );
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when a feature group is not found', async () => {
    const newUser = {
      email: 'johndoe@gmail.com',
      password: '123456',
      name: 'John Doe',
      featureGroupId: '1',
    };

    showFeatureGroupsService.execute = jest
      .fn()
      .mockRejectedValue(
        new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND),
      );

    const spyShowFeatureGroups = jest
      .spyOn(container, 'resolve')
      .mockReturnValue(showFeatureGroupsService);

    const spyFindByEmail = jest.spyOn(fakeUserRepository, 'findByEmail');

    await expect(createUsersService.execute(newUser)).rejects.toThrow(
      new AppError(AppErrorTypes.featureGroups.notFound, NOT_FOUND),
    );

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyShowFeatureGroups).toHaveBeenCalledTimes(1);
  });

  it('should be able to create a user', async () => {
    const user = {
      email: 'johndoe@gmail.com',
      password: '123456',
      name: 'John Doe',
      featureGroupId: '1',
    };

    const featureGroup = await fakeFeatureGroupRepository.create({
      id: '1',
      name: 'feature-group-test-one',
      key: 'feature-group-test-one',
      features: [],
    });

    showFeatureGroupsService.execute = jest.fn().mockReturnValue(featureGroup);

    const spyShowFeatureGroups = jest
      .spyOn(container, 'resolve')
      .mockReturnValue(showFeatureGroupsService);

    const spyFindByEmail = jest.spyOn(fakeUserRepository, 'findByEmail');

    const spyHashPassword = jest.spyOn(fakeBCryptHashProvider, 'generateHash');

    const spyCreate = jest.spyOn(fakeUserRepository, 'create');

    await createUsersService.execute(user);

    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyShowFeatureGroups).toHaveBeenCalledTimes(1);
    expect(spyHashPassword).toHaveBeenCalledTimes(1);

    const userCreated = await fakeUserRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty('createdAt');
    expect(userCreated).toHaveProperty('updatedAt');
    expect(userCreated!.email).toEqual(user.email);
    expect(userCreated!.name).toEqual(user.name);
    expect(userCreated!.password).toEqual(user.password);
  });
});
