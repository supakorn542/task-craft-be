import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';

import { Task, Tag } from '@prisma/client';
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
import { TaskResponseDto } from './dto/task.dto';

type TaskWithTags = Task & { tags: Tag[] };

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  private mapToDto(task: TaskWithTags) {
    return {
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
      deletedAt: task.deletedAt ?? undefined,
    };
  }
  async createTask(
    userId: string,
    dto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    const task = await this.taskRepo.create(userId, dto);

    return this.mapToDto(task as TaskWithTags);
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

  async getTask(id: string, userId: string): Promise<GetTaskDetailResponseDto> {
    const task = await this.taskRepo.findTaskById(id, userId);
    if (!task) throw new NotFoundException(`Task not found`);
    return this.mapToDto(task);
  }

  async updateTask(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskRequestDto,
  ) {
    const updatedTask = await this.taskRepo.update(id, userId, updateTaskDto);

    return this.mapToDto(updatedTask);
  }

  async deleteTask(id: string, userId: string): Promise<TaskResponseDto> {
    const deletedTask = await this.taskRepo.softDelete(id, userId);

    return this.mapToDto(deletedTask);
  }
}
