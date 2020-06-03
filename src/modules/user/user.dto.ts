import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: number;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  addedAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class GetUser {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty({
    required: false,
    enum: ['admin', 'user'],
  })
  role: string;
}
