import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTagRequestDto } from './create-tag.dto';

export class UpdateTagRequestDto extends PartialType(CreateTagRequestDto) {}

export class UpdateTagResponseDto {
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
