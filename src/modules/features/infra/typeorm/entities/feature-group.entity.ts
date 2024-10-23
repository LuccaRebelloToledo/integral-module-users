import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import BaseEntity from '@shared/infra/typeorm/entities/base-entity.entity';

import Feature from './feature.entity';
import User from '@modules/users/infra/typeorm/entities/user.entity';

@Entity('feature_groups')
export default class FeatureGroup extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(
    () => Feature,
    (feature) => feature.featureGroups,
    {
      cascade: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinTable({
    name: 'grouped_features',
    joinColumn: { name: 'feature_group_id' },
    inverseJoinColumn: { name: 'feature_id' },
  })
  features: Feature[];

  @OneToMany(
    () => User,
    (user) => user.featureGroup,
    {
      cascade: true,
    },
  )
  users: User[];
}
