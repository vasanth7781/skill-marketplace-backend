import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ 
    enum: ['Web Development', 'Mobile Development', 'Data Science'],
    example: 'Web Development',
    description: 'Task category'
  })
  @IsEnum(['Web Development', 'Mobile Development', 'Data Science'])
  category: string;

  @ApiProperty({ 
    example: 'Build E-commerce Website',
    description: 'Name of the task'
  })
  @IsString()
  @IsNotEmpty()
  task_name: string;

  @ApiProperty({ 
    example: 'Need a full-stack e-commerce website with payment integration, user authentication, and admin panel',
    description: 'Detailed description of the task'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    example: '2024-02-01',
    description: 'Expected start date for the task (YYYY-MM-DD format)'
  })
  @IsDateString()
  expected_start_date: string;

  @ApiProperty({ 
    example: 120,
    description: 'Expected number of working hours'
  })
  @IsNumber()
  @Min(1)
  expected_working_hours: number;

  @ApiProperty({ 
    example: 50.00,
    description: 'Hourly rate offered'
  })
  @IsNumber()
  @Min(0)
  hourly_rate: number;

  @ApiProperty({ 
    enum: ['USD', 'AUD', 'SGD', 'INR'],
    example: 'USD',
    description: 'Currency for the hourly rate'
  })
  @IsEnum(['USD', 'AUD', 'SGD', 'INR'])
  rate_currency: string;
}