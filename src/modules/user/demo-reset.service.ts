import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DemoResetService {
  private readonly logger = new Logger(DemoResetService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDemoAccount() {
    try {
      const demoEmail = 'demo@taskcraft.com';

      const hashedPassword = await bcrypt.hash('demo1234', 10);
      const demoUser = await this.prisma.user.upsert({
        where: { email: demoEmail },
        update: {},
        create: {
          email: demoEmail,
          password: hashedPassword,
          userName: 'Deme Guest',
        },
      });

      await this.prisma.task.deleteMany({ where: { userId: demoUser.id } });
      await this.prisma.tag.deleteMany({ where: { userId: demoUser.id } });

      const frontendTag = await this.prisma.tag.create({
        data: { name: 'Frontend', color: '#3b82f6', userId: demoUser.id },
      });
      const bugTag = await this.prisma.tag.create({
        data: { name: 'Bug', color: '#ef4444', userId: demoUser.id },
      });

      const backendTag = await this.prisma.tag.create({
        data: {
          name: 'Backend',

          color: '#f7f754',
          userId: demoUser.id,
        },
      });

      const now = new Date();

      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - 2);

      const today = new Date(now);

      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);

      await Promise.all([
        this.prisma.task.create({
          data: {
            title: 'Explore TaskCraft Features',
            description: 'Try creating, updating, and deleting tasks.',
            status: 'DONE',
            dueDate: pastDate,
            userId: demoUser.id,
            tags: {
              connect: [{ id: frontendTag.id }],
            },
          },
        }),

        this.prisma.task.create({
          data: {
            title: 'Report a UI Issue',
            description: 'Found a visual bug on mobile screens.',
            status: 'IN_PROGRESS',
            dueDate: now,
            userId: demoUser.id,
            tags: {
              connect: [{ id: bugTag.id }],
            },
          },
        }),

        this.prisma.task.create({
          data: {
            title: 'Fix type mismatch in Task DTO',
            description:
              'The update API rejects valid requests because the status field is not strictly typed. Need to enforce @IsEnum() in the DTO.',
            status: 'TO_DO',
            dueDate: nextWeek,
            userId: demoUser.id,
            tags: {
              connect: [{ id: backendTag.id }, { id: bugTag.id }],
            },
          },
        }),
      ]);

      this.logger.log('Demo account reset completed successfully!');
    } catch (error) {
      this.logger.error('Failed to reset demo account:', error);
    }
  }
}
