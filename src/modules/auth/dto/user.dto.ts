import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  userName?: string;

  @ApiProperty()
  email: string;

}
