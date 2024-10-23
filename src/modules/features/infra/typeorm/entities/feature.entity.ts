import { Column, Entity, ManyToMany } from 'typeorm';

import BaseEntity from '@shared/infra/typeorm/entities/base-entity.entity';

import FeatureGroup from './feature-group.entity';

@Entity('features')
export default class Feature extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ManyToMany(
    () => FeatureGroup,
    (featureGroup) => featureGroup.features,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  featureGroups: FeatureGroup[];
}
