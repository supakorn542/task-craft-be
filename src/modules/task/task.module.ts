import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskRepository } from './repositories/task.repository';

@Module({
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  imports: [PrismaModule],
  exports: [TaskService],

})
export class TaskModule {}
