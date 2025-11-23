import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskRequestDto } from '../dto/create-task.dto';
import { GetTaskRequestDto } from '../dto/get-task-list.dto';
import { DateFilter } from '../dto/get-task-list.dto';
import { UpdateTaskRequestDto } from '../dto/update-task.dto';
import { isUUID } from 'class-validator';

function getRandomHexColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  private async handleTags(userId: string, tags: string[]) {
    if (!tags || tags.length === 0) {
      return [];
    }

    const tagConnectOps = tags.map(async (tag) => {
      if (isUUID(tag)) {
        return { id: tag };
      }

      const upsertedTag = await this.prisma.tag.upsert({
        where: { name_userId: { name: tag, userId: userId } },
        update: {},
        create: { name: tag, color: getRandomHexColor(), userId: userId },
      });
      return { id: upsertedTag.id };
    });

    return Promise.all(tagConnectOps);
  }

  async create(userId: string, data: CreateTaskRequestDto) {
    const { tags, ...taskData } = data;
    const tagConnectOps = await this.handleTags(userId, tags || []);

    return this.prisma.task.create({
      data: {
        ...taskData,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId,

        tags: {
          connect: tagConnectOps,
        },
      },
      include: { tags: true },
    });
  }

  async findAllByUser(userId: string, query: GetTaskRequestDto) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      filter,
      tagIds,
      sortBy,
      order,
    } = query;

    const where: any = { userId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          id: { in: tagIds },
        },
      };
    }

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

    const orderBy = { [sortBy || 'createdAt']: order || 'desc' };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          tags: true,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total, page, limit };
  }

  async findTaskById(id: string, userId: string) {
    const where: any = { id, deletedAt: null };
    if (userId) where.userId = userId;

    return this.prisma.task.findFirst({
      where,
      include: {
        tags: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskRequestDto,
  ) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!existingTask) throw new NotFoundException(`Task not found`);
    if (existingTask.userId !== userId)
      throw new NotFoundException(`Task not found`);

    const { tags, ...dataToUpdate } = updateTaskDto;

    let tagConnectOps: { id: string }[] | undefined = undefined;

    if (tags) {
      const existingTask = await this.prisma.task.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingTask) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      tagConnectOps = await this.handleTags(existingTask.userId, tags);
    }

    if (dataToUpdate.dueDate) {
      dataToUpdate.dueDate = new Date(dataToUpdate.dueDate);
    }

    const updateTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...dataToUpdate,
        tags: tagConnectOps ? { set: tagConnectOps } : undefined,
      },
      include: { tags: true },
    });
    return updateTask;
  }

  async softDelete(id: string, userId: string) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id: id,
        userId: userId,
        deletedAt: null,
      },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task not found`);
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        tags: true,
      },
    });
  }
}
