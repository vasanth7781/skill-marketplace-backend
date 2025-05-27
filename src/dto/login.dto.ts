import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    example: 'user',
    description: 'Specify whether logging in as user or provider',
    enum: ['user', 'provider']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['user', 'provider'])
  user_type: string;
}