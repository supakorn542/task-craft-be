import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import {
  DashboardBarChartResponseDto,
  DashboardPieChartResponseDto,
  DashboardSummaryResponseDto,
  DashboardTrendResponseDto,
} from './dto/dashboard.dto';
import { TaskResponseDto } from '../task/dto/task.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [DashboardPieChartResponseDto],
  })
  async getTaskNumberByStatus(
    @Req() req,
  ): Promise<DashboardPieChartResponseDto[]> {
    return this.dashboardService.getTaskNumberByStatus(req.user.id);
  }

  @Get('tags')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [DashboardBarChartResponseDto],
  })
  async getTagNumberByTask(
    @Req() req,
  ): Promise<DashboardBarChartResponseDto[]> {
    return this.dashboardService.getTagNumber(req.user.id);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: DashboardSummaryResponseDto,
  })
  async getSummary(@Req() req): Promise<DashboardSummaryResponseDto> {
    return this.dashboardService.getSummary(req.user.id);
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [DashboardTrendResponseDto],
  })
  async getSevenDaysAgoTaskNumber(
    @Req() req,
  ): Promise<DashboardTrendResponseDto[]> {
    return this.dashboardService.getSevenDaysAgoTaskNumber(req.user.id);
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [TaskResponseDto],
  })
  async getRecentActivities(@Req() req): Promise<TaskResponseDto[]> {
    return this.dashboardService.getRecentActivities(req.user.id);
  }
}
