import UserRepositoryInterface from '@modules/users/repositories/user.repository.interface';

import CreateUsersDTO from '@modules/users/dtos/create-users.dto';

import User from '../entities/user.entity';

export default class FakeUserRepository implements UserRepositoryInterface {
  private users: User[] = [];

  public getUsersCount(): number {
    return this.users.length;
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.id === id);

    return findUser || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const findUser = this.users.find((user) => user.email === email);

    return findUser || null;
  }

  public async create(userData: CreateUsersDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    this.users[findIndex] = user;

    return user;
  }

  public async delete(user: User): Promise<void> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );

    this.users.splice(findIndex, 1);
  }
}
