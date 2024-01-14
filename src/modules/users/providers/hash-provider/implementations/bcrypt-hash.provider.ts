import { compare, hash } from 'bcryptjs';

import HashProviderInterface from '../models/hash.provider.interface';

class BCryptHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}

export default BCryptHashProvider;
