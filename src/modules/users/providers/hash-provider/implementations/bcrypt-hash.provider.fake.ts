import HashProviderInterface from '../models/hash.provider.interface';

export default class FakeBCryptHashProvider implements HashProviderInterface {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
