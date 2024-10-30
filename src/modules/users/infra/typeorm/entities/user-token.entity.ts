import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@shared/infra/typeorm/entities/base-entity.entity';
import User from './user.entity';

@Entity('user_tokens')
export default class UserToken extends BaseEntity {
  @Column({ type: 'text', name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'varchar', length: 21, name: 'user_id' })
  userId: string;

  @ManyToOne(
    () => User,
    (user) => user.tokens,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
