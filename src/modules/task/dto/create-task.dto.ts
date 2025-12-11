import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';

import { TaskStatus } from '@prisma/client';
import { TagResponseDto } from 'src/modules/tag/dto/tag.dto';

export class CreateTaskRequestDto {
  @ApiProperty({
    example: 'Finish project report',
    description: 'Title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Complete the final report by Friday',
    description: 'Detailed description of the task',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TO_DO,
    description: 'Current status of the task',
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    example: '2025-09-01T12:00:00Z',
    description: 'Due date of the task in ISO string format',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    example: ['c7a9a7a9-...', 'New Project Tag'],
    description: 'Array of tag IDs or new tag names',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateTaskResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Finish project report' })
  title: string;

  @ApiProperty({
    example: 'Complete the final report by Friday',
    required: false,
  })
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TO_DO })
  status: TaskStatus;

  @ApiProperty({
    example: '2025-09-01T12:00:00Z',
    required: false,
  })
  dueDate?: Date;

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

  @ApiProperty({ example: '2025-08-27T09:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-27T09:30:00Z' })
  updatedAt: Date;

  constructor(partial: Partial<CreateTaskResponseDto>) {
    Object.assign(this, partial);
  }
}
