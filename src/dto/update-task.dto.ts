import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ 
    enum: ['Web Development', 'Mobile Development', 'Data Science'],
    example: 'Web Development',
    description: 'Task category',
    required: false
  })
  @IsOptional()
  @IsEnum(['Web Development', 'Mobile Development', 'Data Science'])
  category?: string;

  @ApiProperty({ 
    example: 'Updated E-commerce Website',
    description: 'Name of the task',
    required: false
  })
  @IsOptional()
  @IsString()
  task_name?: string;

  @ApiProperty({ 
    example: 'Updated requirements for the e-commerce website with additional features',
    description: 'Detailed description of the task',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: '2024-02-15',
    description: 'Expected start date for the task (YYYY-MM-DD format)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  expected_start_date?: string;

  @ApiProperty({ 
    example: 150,
    description: 'Expected number of working hours',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  expected_working_hours?: number;

  @ApiProperty({ 
    example: 55.00,
    description: 'Hourly rate offered',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourly_rate?: number;

  @ApiProperty({ 
    enum: ['USD', 'AUD', 'SGD', 'INR'],
    example: 'USD',
    description: 'Currency for the hourly rate',
    required: false
  })
  @IsOptional()
  @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
  rate_currency?: string;
}