import { PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
