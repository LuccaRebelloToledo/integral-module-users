import { container, inject, injectable } from 'tsyringe';

import UserRepositoryInterface from '../repositories/user.repository.interface';

import ShowUsersService from './show-users.service';

@injectable()
export default class DeleteUsersService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<void> {
    const showUsersService = container.resolve(ShowUsersService);

    const user = await showUsersService.execute(userId);

    await this.userRepository.delete(user);
  }
}
