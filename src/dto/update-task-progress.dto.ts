import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateTaskProgressDto {
  @ApiProperty({
    description: 'Description of the progress made',
    example: 'Completed the initial setup and started working on the main feature'
  })
  @IsString()
  @IsNotEmpty()
  progress_description: string;

  @ApiProperty({
    description: 'Number of hours worked on this update',
    example: 4.5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hours_worked?: number;
}