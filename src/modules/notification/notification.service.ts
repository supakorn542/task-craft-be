import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskRepository } from '../task/repositories/task.repository';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private taskRepo: TaskRepository,
  ) {}

  @Cron('0 0 9 * * *')
  async handleCron() {
    console.log('⏰ Cron Job กำลังทำงาน...');

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const tasks = await this.taskRepo.findUpcomingTasks(
      startOfToday,
      endOfToday,
    );

    console.log(tasks);

    const NOTI_TITLE_KEY = 'noti.daily_reminder';

    for (const task of tasks) {
      const checkedTask = await this.notificationRepo.checkTask(
        task.userId,
        task.id,
        NOTI_TITLE_KEY,
      );

      if (!checkedTask) {
        await this.notificationRepo.create(task.userId, {
          title: NOTI_TITLE_KEY,
          message: JSON.stringify({ taskName: task.title }),
          taskId: task.id,
        });

        console.log(`✅ สร้างแจ้งเตือนให้: ${task.title}`);
      }
    }
  }

  async getAllByUser(userId: string) {
    return this.notificationRepo.findAllByUser(userId);
  }

  async updateIsRead(id: string, userId: string) {
    return this.notificationRepo.updateIsRead(id, userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepo.getUnreadCount(userId);
  }
}
