import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import FeatureGroup from './feature-group.entity';

@Entity('features')
export default class Feature {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @Column('varchar', { unique: true })
  key: string;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => FeatureGroup, (featureGroup) => featureGroup.features, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  featureGroups: FeatureGroup[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
