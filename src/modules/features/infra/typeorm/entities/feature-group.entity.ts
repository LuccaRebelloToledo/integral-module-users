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

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(() => Feature, (feature) => feature.featureGroups, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({
    name: 'grouped_features',
    joinColumn: { name: 'featureGroupId' },
    inverseJoinColumn: { name: 'featureId' },
  })
  features: Feature[];

  @OneToMany(() => User, (user) => user.featureGroup, {
    cascade: true,
  })
  users: User[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
