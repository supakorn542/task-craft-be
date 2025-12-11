import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TaskModule } from 'src/modules/task/task.module';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { TagModule } from '../tag/tag.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [TaskModule, PrismaModule, TagModule],
  exports: [DashboardService]
})
export class DashboardModule {}
