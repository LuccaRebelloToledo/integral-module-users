import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';

import generateNanoId from '@shared/utils/generate-nanoid.util';

export default abstract class BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateNanoId();
  }
}
