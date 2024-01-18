import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import FeatureGroup from '@modules/features/infra/typeorm/entities/feature-group.entity';
import Feature from '@modules/features/infra/typeorm/entities/feature.entity';

@Entity('users')
export default class User {
  @PrimaryColumn({ type: 'varchar', length: 21 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 21 })
  featureGroupId: string;

  @ManyToOne(() => FeatureGroup, (featureGroup) => featureGroup.users, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'featureGroupId' })
  featureGroup: FeatureGroup;

  @ManyToMany(() => Feature, (feature) => feature.userFeatures, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  features?: Feature[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
