import { Injectable } from '@nestjs/common';
import { TaskRepository } from 'src/modules/task/repositories/task.repository';
import { TagRepository } from '../tag/repositories/tag.repository';
import {
  DashboardBarChartResponseDto,
  DashboardPieChartResponseDto,
  DashboardSummaryResponseDto,
  DashboardTrendResponseDto,
} from './dto/dashboard.dto';
import { formatDateToYYYYMMDD } from 'src/common/utils/date.util';
import { TaskResponseDto } from '../task/dto/task.dto';

@Injectable()
export class DashboardService {
  constructor(
    private taskRepo: TaskRepository,
    private tagRepo: TagRepository,
  ) {}

  async getTaskNumberByStatus(
    userId: string,
  ): Promise<DashboardPieChartResponseDto[]> {
    const colors = {
      TO_DO: '#0088FE',
      IN_PROGRESS: '#FFBB28',
      DONE: '#00C49F',
    };
    const task = await this.taskRepo.countByStatus(userId);
    const taskNumber: DashboardPieChartResponseDto[] = task.map((task) => {
      return {
        name: task.status,
        value: task._count.status,
        color: colors[task.status] || '#8884d8',
      };
    });

    return taskNumber;
  }

  async getTagNumber(userId: string): Promise<DashboardBarChartResponseDto[]> {
    const tag = await this.tagRepo.findAllByUserId(userId);

    const tagNumber: DashboardBarChartResponseDto[] = tag.map((tag) => {
      return {
        tagName: tag.name,
        taskCount: tag._count.tasks,
        color: tag.color,
      };
    });

    return tagNumber;
  }

  async getSummary(userId: string): Promise<DashboardSummaryResponseDto> {
    const summary = await this.taskRepo.getSummary(userId);
    return summary;
  }

  async getSevenDaysAgoTaskNumber(
    userId,
  ): Promise<DashboardTrendResponseDto[]> {
    const dateArray: string[] = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      let dateString = formatDateToYYYYMMDD(date);

      dateArray.push(dateString);
    }
    dateArray.reverse();

    const rawTasks = await this.taskRepo.getSevenDaysAgoTaskNumber(userId);

    const trendData = dateArray.map((dateString) => {
      const createdCount = rawTasks.created.filter(
        (t) => formatDateToYYYYMMDD(t.createdAt) === dateString,
      ).length;

      const completedCount = rawTasks.completed.filter(
        (t) => formatDateToYYYYMMDD(t.updatedAt) === dateString,
      ).length;

      return {
        date: dateString,
        created: createdCount,
        completed: completedCount,
      };
    });

    return trendData;
  }

  async getRecentActivities(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepo.findRecent(userId);

    return tasks.map((task) => ({
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
      deletedAt: task.deletedAt ?? undefined,
    }));
  }
}
