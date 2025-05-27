import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TaskCompletionDto {
  @ApiProperty({ 
    example: 'Excellent work! The task has been completed to my satisfaction.',
    description: 'Feedback description for task completion'
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}