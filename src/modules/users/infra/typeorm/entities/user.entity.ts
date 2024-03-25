import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import BaseEntity from '@shared/infra/typeorm/entities/base-entity.entity';
import FeatureGroup from '@modules/features/infra/typeorm/entities/feature-group.entity';
import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

@Entity('users')
export default class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', length: 21, name: 'feature_group_id' })
  featureGroupId: string;

  @ManyToOne(() => FeatureGroup, (featureGroup) => featureGroup.users, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'feature_group_id' })
  featureGroup: FeatureGroup;

  @ManyToMany(() => Feature, (feature) => feature.userFeatures, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  standaloneFeatures?: Feature[];
}
