import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsUUID, Min } from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';
import { Currency } from '../enums/currency.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT })
  @IsEnum(TaskCategory)
  category: TaskCategory;

  @ApiProperty({ example: 'Build a web application' })
  @IsString()
  @IsNotEmpty()
  task_name: string;

  @ApiProperty({ example: 'Develop a full-stack web application using React and Node.js' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  expected_start_date: string;

  @ApiProperty({ example: 40.5 })
  @IsNumber()
  @Min(0)
  expected_working_hours: number;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  @Min(0)
  hourly_rate: number;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  @IsEnum(Currency)
  rate_currency: Currency;
}

export class UpdateTaskDto {
  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT, required: false })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @ApiProperty({ example: 'Build a web application', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  task_name?: string;

  @ApiProperty({ example: 'Develop a full-stack web application using React and Node.js', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  expected_start_date?: string;

  @ApiProperty({ example: 40.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expected_working_hours?: number;

  @ApiProperty({ example: 50.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourly_rate?: number;

  @ApiProperty({ enum: Currency, example: Currency.USD, required: false })
  @IsOptional()
  @IsEnum(Currency)
  rate_currency?: Currency;
}

export class TaskResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT })
  category: TaskCategory;

  @ApiProperty({ example: 'Build a web application' })
  task_name: string;

  @ApiProperty({ example: 'Develop a full-stack web application using React and Node.js' })
  description: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  expected_start_date: Date;

  @ApiProperty({ example: 40.5 })
  expected_working_hours: number;

  @ApiProperty({ example: 50.00 })
  hourly_rate: number;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  rate_currency: Currency;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.OPEN })
  status: TaskStatus;

  @ApiProperty({ example: 'uuid-string' })
  user_id: string;

  @ApiProperty({ example: 'uuid-string', required: false })
  accepted_provider_id?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;

  @ApiProperty({ example: 'Great work! Everything looks perfect.', required: false })
  completion_feedback?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  completion_feedback_date?: Date;
}

export class UpdateTaskProgressDto {
  @ApiProperty({ example: 'Completed the initial setup and database design' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class TaskProgressResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'uuid-string' })
  task_id: string;

  @ApiProperty({ example: 'uuid-string' })
  provider_id: string;

  @ApiProperty({ example: 'Completed the initial setup and database design' })
  description: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;
}

export class AcceptTaskCompletionDto {
  @ApiProperty({ 
    example: 'Excellent work! The task has been completed to my satisfaction. All requirements were met and the quality is outstanding.',
    description: 'Feedback message when accepting task completion'
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class RejectTaskCompletionDto {
  @ApiProperty({ 
    example: 'The task needs some revisions. Please fix the responsive design issues on mobile devices and update the color scheme as discussed.',
    description: 'Feedback message when rejecting task completion with reasons for rejection'
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class TaskCompletionFeedbackResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'uuid-string' })
  task_id: string;

  @ApiProperty({ example: 'uuid-string' })
  user_id: string;

  @ApiProperty({ example: 'accepted' })
  action_type: string;

  @ApiProperty({ example: 'Excellent work! The task has been completed to my satisfaction.' })
  description: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;
}