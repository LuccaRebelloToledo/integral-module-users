export default interface BaseRepositoryInterface<T> {
  findAll(paramsDto: unknown): Promise<unknown>;
  findById(id: string): Promise<T | null>;
  create(entityDataDto: unknown): Promise<T>;
  save(entityData: T): Promise<T>;
  delete(entityData: T): Promise<void>;
  softDelete(entityData: T): Promise<void>;
}
