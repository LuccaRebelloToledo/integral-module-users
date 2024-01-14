import CreateUsersDTO from '../dtos/create-users.dto';

import User from '../infra/typeorm/entities/user.entity';

export default interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUsersDTO): Promise<User>;
  save(userData: User): Promise<User>;
  delete(userData: User): Promise<void>;
}
