import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
  IsArray,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { TagResponseDto } from 'src/modules/tag/dto/tag.dto';
import { Transform } from 'class-transformer';

export enum DateFilter {
  ALL = 'ALL',
  TODAY = 'TODAY',
  UPCOMING = 'UPCOMING',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TaskSortBy {
  CREATED_AT = 'createdAt',
  DUE_DATE = 'dueDate',
}

export class GetTaskRequestDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: DateFilter, default: DateFilter.ALL })
  @IsOptional()
  @IsEnum(DateFilter)
  filter?: DateFilter = DateFilter.ALL;

  @ApiPropertyOptional({ example: 'project' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter tasks by tag IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.includes(',') ? value.split(',') : [value];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  })
  tagIds?: string[];

  @ApiPropertyOptional({ enum: TaskSortBy, default: TaskSortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(TaskSortBy)
  sortBy?: TaskSortBy = TaskSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class GetTaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  dueDate?: Date;

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetPaginatedTaskResponseDto {
  @ApiProperty({ type: [GetTaskResponseDto] })
  tasks: GetTaskResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
