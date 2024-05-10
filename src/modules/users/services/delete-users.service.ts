import { container, inject, injectable } from 'tsyringe';

import UsersRepositoryInterface from '../repositories/users.repository.interface';

import ShowUsersService from './show-users.service';

@injectable()
export default class DeleteUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<void> {
    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(userId);

    await this.usersRepository.delete(user);
  }
}
