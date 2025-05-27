import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'user' })
  user_type: string;

  @ApiProperty({ example: 'uuid-string' })
  user_id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;
}