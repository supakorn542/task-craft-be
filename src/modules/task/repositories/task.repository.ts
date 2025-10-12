import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskRequestDto } from '../dto/create-task.dto';
import { GetTaskRequestDto } from '../dto/get-task-list.dto';
import { DateFilter } from '../dto/get-task-list.dto';
import { UpdateTaskRequestDto } from '../dto/update-task.dto';

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
    const { page = 1, limit = 10, status, search, filter } = query;

    const where: any = { userId };
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (filter && filter !== DateFilter.ALL) {
      if (filter === DateFilter.TODAY) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        where.dueDate = { gte: today, lt: tomorrow };
      }

      if (filter === DateFilter.UPCOMING) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        where.dueDate = { gt: today };
      }
    }

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

  async findTaskById(id: string) {
    const where: any = { id };
    return this.prisma.task.findUnique({
      where,
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskRequestDto) {

    const dataToUpdate: any = { ...updateTaskDto };

    if (dataToUpdate.dueDate) {
      dataToUpdate.dueDate = new Date(dataToUpdate.dueDate);
    }
    
    const updateTask = await this.prisma.task.update({
      where: { id },
      data: dataToUpdate,
    });
    return updateTask;
  }
}
