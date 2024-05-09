import { compare, hash } from 'bcryptjs';

import HashProviderInterface from '../models/hash.provider.interface';

export default class BCryptHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return await hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}
