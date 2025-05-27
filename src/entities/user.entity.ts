import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';

export enum UserType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserType })
  user_type: UserType;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  business_tax_number: string;

  @Column({ nullable: true })
  representative_first_name: string;

  @Column({ nullable: true })
  representative_last_name: string;

  @Column({ nullable: true })
  representative_email: string;

  @Column({ nullable: true })
  representative_mobile: string;

  @Column({ nullable: true })
  street_number: string;

  @Column({ nullable: true })
  street_name: string;

  @Column({ nullable: true })
  city_suburb: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  post_code: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}