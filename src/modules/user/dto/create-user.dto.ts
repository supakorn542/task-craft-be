import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
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

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string | null; 

  @Exclude() 
  password: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
