import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from './provider.entity';
import { TaskCategory } from '../enums/task-category.enum';

export enum NatureOfWork {
  ONSITE = 'onsite',
  ONLINE = 'online'
}

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TaskCategory })
  category: TaskCategory;

  @Column()
  experience: string;

  @Column({ type: 'enum', enum: NatureOfWork })
  nature_of_work: NatureOfWork;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ type: 'uuid' })
  provider_id: string;

  @ManyToOne(() => Provider, provider => provider.skills)
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}