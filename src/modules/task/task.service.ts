import { Injectable } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { TaskRepository } from './repositories/task.repository';
import {
  GetTaskRequestDto,
  GetPaginatedTaskResponseDto,
  GetTaskResponseDto,
} from './dto/get-task-list.dto';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}
  async createTask(userId: string, dto: CreateTaskRequestDto): Promise<Task> {
    return this.taskRepo.create(userId, dto);
  }

  async getTasks(
    userId: string,
    query: GetTaskRequestDto,
  ): Promise<GetPaginatedTaskResponseDto> {
    const { tasks, total, page, limit } = await this.taskRepo.findAllByUser(
      userId,
      query,
    );

    const tasksDto: GetTaskResponseDto[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return { tasks: tasksDto, total, page, limit };
  }
}
