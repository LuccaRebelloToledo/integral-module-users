import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import BaseEntity from '@shared/infra/typeorm/entities/base-entity';

import FeatureGroup from './feature-group.entity';
import User from '@modules/users/infra/typeorm/entities/user.entity';

@Entity('features')
export default class Feature extends BaseEntity {
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
    joinColumn: { name: 'feature_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  userFeatures: User[];
}
