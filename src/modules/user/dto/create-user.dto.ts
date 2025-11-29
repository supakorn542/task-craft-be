import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsEmail() 
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true })
  @IsString() 
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
