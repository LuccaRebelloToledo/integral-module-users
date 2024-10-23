import { inject, injectable } from 'tsyringe';

import type IUsersRepository from '../repositories/users.repository.interface';

import getUserById from '../utils/get-user-by-id.util';

@injectable()
export default class DeleteUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const user = await getUserById(id);

    await this.usersRepository.delete(user.id);
  }
}
