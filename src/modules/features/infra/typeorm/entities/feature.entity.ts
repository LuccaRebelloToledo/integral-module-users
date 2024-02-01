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

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(() => FeatureGroup, (featureGroup) => featureGroup.features, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  featureGroups: FeatureGroup[];

  @ManyToMany(() => User, (user) => user.standaloneFeatures, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: false,
    nullable: true,
  })
  @JoinTable({
    name: 'user_features',
    joinColumn: { name: 'featureId' },
    inverseJoinColumn: { name: 'userId' },
  })
  userFeatures: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
