import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationRepository } from './repositories/notification.repository';
import { TaskRepository } from '../task/repositories/task.repository';
import { NotificationGateWay } from './notification.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    TaskRepository,
    NotificationGateWay,
  ],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
