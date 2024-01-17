import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import Feature from './feature.entity';
import User from '@modules/users/infra/typeorm/entities/user.entity';

@Entity('feature_groups')
export default class FeatureGroup {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @Column('varchar', { unique: true })
  key: string;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => Feature, (feature) => feature.featureGroups, {
    cascade: true,
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'grouped_features' })
  features: Feature[];

  @OneToMany(() => User, (user) => user.featureGroup, {
    cascade: true,
  })
  users: User[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}