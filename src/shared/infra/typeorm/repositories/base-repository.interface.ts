export default interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  create(entityDto: unknown): Promise<T>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
