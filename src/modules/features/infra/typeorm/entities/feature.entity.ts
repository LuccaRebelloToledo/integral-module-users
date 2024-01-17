import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import FeatureGroup from './feature-group.entity';
import User from '@modules/users/infra/typeorm/entities/user.entity';

@Entity('features')
export default class Feature {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @Column('varchar', { unique: true })
  key: string;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => FeatureGroup, (featureGroup) => featureGroup.features, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  featureGroups: FeatureGroup[];

  @ManyToMany(() => User, (user) => user.features, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable({
    name: 'user_features',
    joinColumn: { name: 'featureId' },
    inverseJoinColumn: { name: 'userId' },
  })
  userFeatures: User[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
