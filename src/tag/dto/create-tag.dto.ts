import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTagRequestDto {
  @ApiProperty({
    example: 'Urgent',
    description: 'Title of the tag',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Color code of the tag',
  })
  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tasks?: string[];
}

export class CreateTagResponseDto {
  @ApiProperty({ example: 'c7a9a7a9-b8f0-4f3a-9c7b-1e2d3f4a5b6c' })
  id: string;

  @ApiProperty({ example: 'Urgent' })
  name: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;

  @ApiProperty({ example: '2025-08-27T09:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-27T09:30:00Z' })
  updatedAt: Date;
}
