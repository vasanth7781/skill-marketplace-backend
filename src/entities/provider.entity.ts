import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Skill } from './skill.entity';
import { Offer } from './offer.entity';

export enum ProviderType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ProviderType })
  provider_type: ProviderType;

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

  @OneToMany(() => Skill, skill => skill.provider)
  skills: Skill[];

  @OneToMany(() => Offer, offer => offer.provider)
  offers: Offer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}