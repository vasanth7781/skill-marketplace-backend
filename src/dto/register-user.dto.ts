import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class RegisterUserDto {
  @ApiProperty({ enum: UserType, example: UserType.INDIVIDUAL })
  @IsEnum(UserType)
  user_type: UserType;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  mobile_number?: string;

  @ApiProperty({ example: 'Tech Corp', required: false })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiProperty({ example: 'ABC1234567', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{10}$/, { message: 'Business tax number must be 10 characters with capital letters and digits' })
  business_tax_number?: string;

  @ApiProperty({ example: 'Jane', required: false })
  @IsOptional()
  @IsString()
  representative_first_name?: string;

  @ApiProperty({ example: 'Smith', required: false })
  @IsOptional()
  @IsString()
  representative_last_name?: string;

  @ApiProperty({ example: 'jane.smith@example.com', required: false })
  @IsOptional()
  @IsEmail()
  representative_email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  representative_mobile?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString()
  street_number?: string;

  @ApiProperty({ example: 'Main Street', required: false })
  @IsOptional()
  @IsString()
  street_name?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  city_suburb?: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '10001', required: false })
  @IsOptional()
  @IsString()
  post_code?: string;
}