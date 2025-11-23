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
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
} from './dto/create-task.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Task } from '@prisma/client';
import { ApiResponse } from '@nestjs/swagger';
import {
  GetPaginatedTaskResponseDto,
  GetTaskRequestDto,
} from './dto/get-task-list.dto';
import { GetTaskDetailResponseDto } from './dto/get-task.dto';
import {
  UpdateTaskRequestDto,
  UpdateTaskResponseDto,
} from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task.dto';

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
  ): Promise<CreateTaskResponseDto> {
    const userId = req.user.id;
    return this.taskService.createTask(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    type: GetPaginatedTaskResponseDto,
    description:
      'Get all tasks of the user with optional filters and pagination',
  })
  async getTasks(@Req() req, @Query() query: GetTaskRequestDto) {
    const userId = req.user.id;
    return this.taskService.getTaskList(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: GetTaskDetailResponseDto,
    description: 'Get  task by id',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(
    @Param('id') id: string,
    @Req() req,
  ): Promise<GetTaskDetailResponseDto> {
    return this.taskService.getTask(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: UpdateTaskResponseDto,
    description: 'Update Task',
  })
  async updateTask(
    @Param('id') id: string,
    @Req() req,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    return this.taskService.updateTask(id, req.user.id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: TaskResponseDto,
    description: 'Delete Task',
  })
  async deleteTask(
    @Param('id') id: string,
    @Req() req,
  ): Promise<TaskResponseDto> {
    return this.taskService.deleteTask(id, req.user.id);
  }
}
