import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';

export enum OfferResponseType {
  ACCEPT = 'accept',
  REJECT = 'reject'
}

export class RespondToOfferDto {
  @ApiProperty({
    enum: OfferResponseType,
    example: OfferResponseType.ACCEPT,
    description: 'Response to the offer - accept or reject'
  })
  @IsEnum(OfferResponseType)
  @IsNotEmpty()
  response: OfferResponseType;
}