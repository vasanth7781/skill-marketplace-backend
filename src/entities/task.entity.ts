import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Offer } from './offer.entity';
import { TaskProgress } from './task-progress.entity';
import { TaskCompletionFeedback } from './task-completion-feedback.entity';
import { TaskCategory } from '../enums/task-category.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { Currency } from '../enums/currency.enum';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TaskCategory })
  category: TaskCategory;

  @Column()
  task_name: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  expected_start_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  expected_working_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ type: 'enum', enum: Currency })
  rate_currency: Currency;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  accepted_provider_id: string;

  @Column({ type: 'text', nullable: true })
  completion_feedback: string;

  @Column({ type: 'timestamp', nullable: true })
  completion_feedback_date: Date;

  @OneToMany(() => Offer, offer => offer.task)
  offers: Offer[];

  @OneToMany(() => TaskProgress, progress => progress.task)
  progress_updates: TaskProgress[];

  @OneToMany(() => TaskCompletionFeedback, feedback => feedback.task)
  completion_feedback_history: TaskCompletionFeedback[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}