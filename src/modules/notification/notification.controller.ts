import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { NotificationResponseDto } from './dto/notification.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get all notification by user',
    type: [NotificationResponseDto],
  })
  async getAllByUser(@Req() req): Promise<NotificationResponseDto[]> {
    return this.notificationService.getAllByUser(req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Update read status notification',
    type: NotificationResponseDto,
  })
  async updateIsRead(
    @Param('id') id: string,
    @Req() req,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.updateIsRead(id, req.user.id);
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get unread notification number',
    type: UnreadCountResponseDto,
  })
  async getUnreadCount(@Req() req): Promise<UnreadCountResponseDto> {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }
}
