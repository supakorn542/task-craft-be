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

    const responseDto: CreateTaskResponseDto = {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description ?? undefined,
      status: createdTask.status,
      dueDate: createdTask.dueDate ?? undefined,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt,
    };

    return responseDto;
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
      description: task.description ?? undefined,
      status: task.status,
      dueDate: task.dueDate ?? undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return { tasks: tasksDto, total, page, limit };
  }

  async getTask(id: string): Promise<GetTaskDetailResponseDto> {
    const task = await this.taskRepo.findTaskById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    const taskDto: GetTaskDetailResponseDto = {
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      status: task.status,
      dueDate: task.dueDate ?? undefined,
    };
    return taskDto;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskRequestDto) {
    const existingTask = await this.taskRepo.findTaskById(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const updatedTask = await this.taskRepo.update(id, updateTaskDto);

    const responseDto: UpdateTaskResponseDto = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description ?? undefined,
      status: updatedTask.status,
      dueDate: updatedTask.dueDate ?? undefined,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
    };

    return responseDto;
  }
}
