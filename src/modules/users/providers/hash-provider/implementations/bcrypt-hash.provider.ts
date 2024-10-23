import { compare, genSalt, hash } from 'bcryptjs';

import type IHashProvider from '../models/hash.provider.interface';

export default class HashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const salt = await genSalt();

    return await hash(payload, salt);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}
