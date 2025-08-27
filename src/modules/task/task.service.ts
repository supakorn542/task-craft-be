import { Injectable } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository){}
  async createTask(userId: string, dto: CreateTaskRequestDto): Promise<Task> {
    return this.taskRepo.create(userId, dto);
  }

}
