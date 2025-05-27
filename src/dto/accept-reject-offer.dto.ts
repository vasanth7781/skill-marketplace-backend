import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AcceptRejectOfferDto {
  @ApiProperty({ 
    enum: ['accept', 'reject'],
    example: 'accept',
    description: 'Action to take on the offer'
  })
  @IsEnum(['accept', 'reject'])
  action: string;

  @ApiProperty({ 
    example: 'Looking for someone with more experience in React',
    description: 'Reason for rejecting the offer (optional, only for reject action)',
    required: false
  })
  @IsOptional()
  @IsString()
  reason?: string;
}