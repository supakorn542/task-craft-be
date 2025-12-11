import { ApiProperty } from '@nestjs/swagger';

export class DashboardPieChartResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  color: string;
}

export class DashboardBarChartResponseDto {
  @ApiProperty()
  tagName: string;

  @ApiProperty()
  taskCount: number;

  @ApiProperty()
  color: string;
}

export class DashboardSummaryResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  completed: number;

  @ApiProperty()
  inProgress: number;

  @ApiProperty()
  overdue: number;
}

export class DashboardTrendResponseDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  created: number;

  @ApiProperty()
  completed: number;
}
