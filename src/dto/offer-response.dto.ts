import { ApiProperty } from '@nestjs/swagger';

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