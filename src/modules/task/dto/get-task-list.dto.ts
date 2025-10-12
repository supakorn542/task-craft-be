import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export enum DateFilter {
  ALL = 'ALL',
  TODAY = 'TODAY',
  UPCOMING = 'UPCOMING',
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
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  limit?: number;
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

  @ApiProperty({ type: String, format: 'date-time'})
  dueDate?: Date;

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
