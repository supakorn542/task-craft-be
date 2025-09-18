import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskRequestDto } from '../dto/create-task.dto';
import { GetTaskRequestDto } from '../dto/get-task-list.dto';
import { contains } from 'class-validator';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateTaskRequestDto) {
    return this.prisma.task.create({
      data: {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        ...data,
        userId,
      },
    });
  }

  async findAllByUser(userId: string, query: GetTaskRequestDto) {
    const { page = 1, limit = 10, status, priority, search } = query;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const take = Number(limit);
    const skip = Number((page - 1) * limit);

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total, page, limit };
  }
}
