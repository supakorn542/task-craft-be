import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';

import { Task } from '@prisma/client';
import { TaskRepository } from './repositories/task.repository';
import {
  GetTaskRequestDto,
  GetPaginatedTaskResponseDto,
  GetTaskResponseDto,
} from './dto/get-task-list.dto';
import { GetTaskDetailResponseDto } from './dto/get-task.dto';
import {
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}
  async createTask(
    userId: string,
    dto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    const createdTask = await this.taskRepo.create(userId, dto);

    const taskWithTags = await this.taskRepo.findTaskById(createdTask.id);

    if (!taskWithTags) {
      throw new NotFoundException('Failed to retrieve task after creation.');
    }

    return {
      ...taskWithTags,
      description: taskWithTags.description ?? undefined,
      dueDate: taskWithTags.dueDate ?? undefined,
    };
  }

  async getTaskList(
    userId: string,
    query: GetTaskRequestDto,
  ): Promise<GetPaginatedTaskResponseDto> {
    const { tasks, total, page, limit } = await this.taskRepo.findAllByUser(
      userId,
      query,
    );

    const tasksDto: GetTaskResponseDto[] = tasks.map((task) => ({
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
    }));

    return { tasks: tasksDto, total, page, limit };
  }

  async getTask(id: string): Promise<GetTaskDetailResponseDto> {
    const task = await this.taskRepo.findTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return {
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
    };
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskRequestDto) {
    const existingTask = await this.taskRepo.findTaskById(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    await this.taskRepo.update(id, updateTaskDto);
    const updatedTaskWithTags = await this.taskRepo.findTaskById(id);

    if (!updatedTaskWithTags) {
      throw new NotFoundException(`Failed to retrieve task after update.`);
    }

    return {
      ...updatedTaskWithTags,
      description: updatedTaskWithTags.description ?? undefined,
      dueDate: updatedTaskWithTags.dueDate ?? undefined,
    };
  }
}
