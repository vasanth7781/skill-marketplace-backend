import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';
import { NatureOfWork } from '../entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT })
  @IsEnum(TaskCategory)
  category: TaskCategory;

  @ApiProperty({ example: '5 years in React and Node.js development' })
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty({ enum: NatureOfWork, example: NatureOfWork.ONLINE })
  @IsEnum(NatureOfWork)
  nature_of_work: NatureOfWork;

  @ApiProperty({ example: 45.00 })
  @IsNumber()
  @Min(0)
  hourly_rate: number;
}

export class UpdateSkillDto {
  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT, required: false })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @ApiProperty({ example: '5 years in React and Node.js development', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  experience?: string;

  @ApiProperty({ enum: NatureOfWork, example: NatureOfWork.ONLINE, required: false })
  @IsOptional()
  @IsEnum(NatureOfWork)
  nature_of_work?: NatureOfWork;

  @ApiProperty({ example: 45.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourly_rate?: number;
}

export class SkillResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ enum: TaskCategory, example: TaskCategory.WEB_DEVELOPMENT })
  category: TaskCategory;

  @ApiProperty({ example: '5 years in React and Node.js development' })
  experience: string;

  @ApiProperty({ enum: NatureOfWork, example: NatureOfWork.ONLINE })
  nature_of_work: NatureOfWork;

  @ApiProperty({ example: 45.00 })
  hourly_rate: number;

  @ApiProperty({ example: 'uuid-string' })
  provider_id: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}