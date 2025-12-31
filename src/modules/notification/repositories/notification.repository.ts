import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateNotificationRequestDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, notificationData: CreateNotificationRequestDto) {
    return this.prisma.notification.create({
      data: {
        title: notificationData.title,
        message: notificationData.message,
        taskId: notificationData.taskId,
        userId,
      },
    });
  }

  async checkTask(userId: string, taskId: string, title: string) {
    return await this.prisma.notification.findFirst({
      where: {
        userId,
        taskId,
        title,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateIsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        isRead: false,
        userId,
      },
    });
  }
}
