import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationRepository } from './repositories/notification.repository';
import { TaskRepository } from '../task/repositories/task.repository';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, TaskRepository],
  imports: [PrismaModule],
  exports: [NotificationService],
})
export class NotificationModule {}
