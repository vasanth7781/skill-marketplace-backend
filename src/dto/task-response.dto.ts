import { ApiProperty } from '@nestjs/swagger';
import { TaskCategory } from '../enums/task-category.enum';
import { Currency } from '../enums/currency.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the task',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    enum: TaskCategory, 
    example: TaskCategory.WEB_DEVELOPMENT,
    description: 'Category of the task'
  })
  category: TaskCategory;

  @ApiProperty({ 
    description: 'Name of the task',
    example: 'Build a web application' 
  })
  task_name: string;

  @ApiProperty({ 
    description: 'Detailed description of the task',
    example: 'Develop a full-stack web application using React and Node.js' 
  })
  description: string;

  @ApiProperty({ 
    description: 'Expected start date for the task',
    example: '2024-01-15T00:00:00.000Z' 
  })
  expected_start_date: string;

  @ApiProperty({ 
    description: 'Expected working hours for the task',
    example: 40.5 
  })
  expected_working_hours: number;

  @ApiProperty({ 
    description: 'Hourly rate for the task',
    example: 50.00 
  })
  hourly_rate: number;

  @ApiProperty({ 
    enum: Currency, 
    example: Currency.USD,
    description: 'Currency for the rate'
  })
  rate_currency: Currency;

  @ApiProperty({ 
    enum: TaskStatus, 
    example: TaskStatus.OPEN,
    description: 'Current status of the task'
  })
  status: TaskStatus;

  @ApiProperty({ 
    description: 'ID of the user who created the task',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  user_id: string;

  @ApiProperty({ 
    description: 'Task creation timestamp',
    example: '2024-01-01T00:00:00.000Z' 
  })
  created_at: string;

  @ApiProperty({ 
    description: 'Task last update timestamp',
    example: '2024-01-01T00:00:00.000Z' 
  })
  updated_at: string;
}