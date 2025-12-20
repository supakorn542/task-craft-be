import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserRequestDto) {}

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  userName?: string;
}
