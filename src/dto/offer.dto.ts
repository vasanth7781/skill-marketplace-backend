import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, Min, IsEnum } from 'class-validator';
import { OfferStatus } from '../enums/offer-status.enum';

export class CreateOfferDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Task ID to make offer for'
  })
  @IsUUID()
  @IsNotEmpty()
  task_id: string;

  @ApiProperty({ 
    example: 45.00,
    description: 'Proposed hourly rate'
  })
  @IsNumber()
  @Min(0)
  proposed_rate: number;

  @ApiProperty({ 
    enum: ['USD', 'AUD', 'SGD', 'INR'],
    example: 'USD',
    description: 'Currency for the proposed rate'
  })
  @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
  rate_currency: string;

  @ApiProperty({ 
    example: 100,
    description: 'Estimated hours to complete the task'
  })
  @IsNumber()
  @Min(1)
  estimated_hours: number;

  @ApiProperty({ 
    example: 'I have 5+ years of experience in full-stack development with expertise in React, Node.js, and PostgreSQL.',
    description: 'Cover letter explaining why you are suitable for this task',
    required: false
  })
  @IsOptional()
  @IsString()
  cover_letter?: string;

  @ApiProperty({ 
    example: 'I have 5 years of experience in this field and can deliver quality work.',
    description: 'Additional message for the offer',
    required: false
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateOfferDto {
  @ApiProperty({ 
    example: 45.00,
    description: 'Updated proposed hourly rate',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  proposed_rate?: number;

  @ApiProperty({ 
    enum: ['USD', 'AUD', 'SGD', 'INR'],
    example: 'USD',
    description: 'Updated currency for the proposed rate',
    required: false
  })
  @IsOptional()
  @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
  rate_currency?: string;

  @ApiProperty({ 
    example: 100,
    description: 'Updated estimated hours to complete the task',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimated_hours?: number;

  @ApiProperty({ 
    example: 'Updated cover letter with more details...',
    description: 'Updated cover letter',
    required: false
  })
  @IsOptional()
  @IsString()
  cover_letter?: string;

  @ApiProperty({ 
    example: 'Updated message for the offer',
    description: 'Updated additional message',
    required: false
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateOfferStatusDto {
  @ApiProperty({ enum: OfferStatus, example: OfferStatus.ACCEPTED })
  @IsEnum(OfferStatus)
  status: OfferStatus;
}

export class OfferResponseDto {
  @ApiProperty({
    description: 'Offer ID',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'Provider ID who made the offer',
    example: 'uuid-string'
  })
  provider_id: string;

  @ApiProperty({
    description: 'Task ID for which the offer was made',
    example: 'uuid-string'
  })
  task_id: string;

  @ApiProperty({
    description: 'Proposed hourly rate',
    example: 25.00
  })
  proposed_rate: number;

  @ApiProperty({
    description: 'Rate currency',
    example: 'USD'
  })
  rate_currency: string;

  @ApiProperty({
    description: 'Estimated hours to complete the task',
    example: 40
  })
  estimated_hours: number;

  @ApiProperty({
    description: 'Cover letter for the offer',
    example: 'I am interested in working on this project...'
  })
  cover_letter: string;

  @ApiProperty({
    description: 'Additional message for the offer',
    example: 'I have 5 years of experience in this field...',
    required: false
  })
  message?: string;

  @ApiProperty({
    description: 'Offer status',
    example: 'pending',
    enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'counter_offered', 'pending_completion_approval', 'completion_accepted', 'completion_rejected']
  })
  status: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Build a web application',
    required: false
  })
  task_name?: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Develop a full-stack web application',
    required: false
  })
  task_description?: string;

  @ApiProperty({
    description: 'Task status',
    example: 'IN_PROGRESS',
    required: false
  })
  task_status?: string;

  @ApiProperty({
    description: 'Latest completion feedback description',
    example: 'Excellent work! Task completed perfectly.',
    required: false
  })
  completion_feedback?: string;

  @ApiProperty({
    description: 'Completion feedback date',
    example: '2024-01-01T12:00:00.000Z',
    required: false
  })
  completion_feedback_date?: string;

  @ApiProperty({
    description: 'Latest feedback action type',
    example: 'accepted',
    required: false
  })
  latest_feedback_action?: string;

  @ApiProperty({
    description: 'Offer creation date',
    example: '2023-12-01T10:00:00.000Z'
  })
  created_at: string;

  @ApiProperty({
    description: 'Offer last update date',
    example: '2023-12-01T10:00:00.000Z'
  })
  updated_at: string;
}