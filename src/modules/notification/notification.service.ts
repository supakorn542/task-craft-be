import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskRepository } from '../task/repositories/task.repository';
import { NotificationGateWay } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private taskRepo: TaskRepository,
    private notificationGateway: NotificationGateWay,
  ) {}

  @Cron('0 0 9 * * *')
  async handleMorningBrief() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const tasks = await this.taskRepo.findUpcomingTasks(
      startOfToday,
      endOfToday,
    );

    const NOTI_TITLE_KEY = 'Notifications.daily_reminder';

    for (const task of tasks) {
      const checkedTask = await this.notificationRepo.checkTask(
        task.userId,
        task.id,
        NOTI_TITLE_KEY,
      );

      if (!checkedTask) {
        const newNotification = await this.notificationRepo.create(
          task.userId,
          {
            title: NOTI_TITLE_KEY,
            message: JSON.stringify({ taskName: task.title }),
            taskId: task.id,
          },
        );

        this.notificationGateway.sendToUser(
          task.userId,
          'new_notification',
          newNotification,
        );
      }
    }
  }

  @Cron('0 0 20 * * *')
  async handleEveningNudge() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const unfinishedTasks = await this.taskRepo.findUpcomingTasks(
      startOfToday,
      endOfToday,
    );

    const NOTI_TITLE_KEY = 'Notifications.evening_reminder';

    for (const task of unfinishedTasks) {
      const checkedTask = await this.notificationRepo.checkTask(
        task.userId,
        task.id,
        NOTI_TITLE_KEY,
      );

      if (!checkedTask) {
        const newNotification = await this.notificationRepo.create(
          task.userId,
          {
            title: NOTI_TITLE_KEY,
            message: JSON.stringify({ taskName: task.title }),
            taskId: task.id,
          },
        );

        this.notificationGateway.sendToUser(
          task.userId,
          'new_notification',
          newNotification,
        );
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

  @Cron('0 0 0 * * *')
  async handleCleanup() {
    const daysToKeep = 3;
    const cleanupDate = new Date();
    cleanupDate.setDate(cleanupDate.getDate() - daysToKeep);

    await this.notificationRepo.deleteOlderThan(cleanupDate);
  }
}
