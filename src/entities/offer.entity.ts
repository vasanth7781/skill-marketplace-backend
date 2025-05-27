import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Provider } from './provider.entity';
import { Task } from './task.entity';
import { OfferStatus } from '../enums/offer-status.enum';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  provider_id: string;

  @Column({ type: 'uuid' })
  task_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  proposed_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_rate: number;

  @Column({ nullable: true })
  rate_currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimated_hours: number;

  @Column('text', { nullable: true })
  message: string;

  @Column('text', { nullable: true })
  cover_letter: string;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  @ManyToOne(() => Provider, provider => provider.offers)
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => Task, task => task.offers)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}