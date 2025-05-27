import { ApiProperty } from '@nestjs/swagger';

export class TaskProgressResponseDto {
  @ApiProperty({ 
    description: 'Unique identifier for the progress entry',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'ID of the task this progress belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  task_id: string;

  @ApiProperty({ 
    description: 'ID of the provider who made this progress update',
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  provider_id: string;

  @ApiProperty({ 
    description: 'Description of the progress made',
    example: 'Completed the initial setup and database design' 
  })
  description: string;

  @ApiProperty({ 
    description: 'Timestamp when the progress was created',
    example: '2024-01-01T00:00:00.000Z' 
  })
  created_at: string;
}