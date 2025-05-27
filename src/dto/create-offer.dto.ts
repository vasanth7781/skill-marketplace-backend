import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, Min, IsEnum } from 'class-validator';

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
}