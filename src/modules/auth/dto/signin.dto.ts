import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  token: string;
}
