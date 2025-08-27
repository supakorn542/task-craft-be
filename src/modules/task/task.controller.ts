import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Task } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    type: CreateTaskResponseDto,
    description: 'Task successfully created',
  })
  @Post()
  async createTask(
    @Req() req,
    @Body() dto: CreateTaskRequestDto,
  ): Promise<Task> {
    const userId = req.user.id;
    return this.taskService.createTask(userId, dto);
  }
}
