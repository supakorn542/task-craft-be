import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskRequestDto } from '../dto/create-task.dto';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateTaskRequestDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }
}
