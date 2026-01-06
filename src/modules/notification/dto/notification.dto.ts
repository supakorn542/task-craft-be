import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: 'uuid-string-1234' })
  id: string;

  @ApiProperty({ example: 'noti.daily_reminder' })
  title: string;

  @ApiProperty({
    example: '{"taskName": "Test Cron1"}',
    description: 'JSON string containing message parameters',
  })
  message: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: 'uuid-task-id-5678', nullable: true, type: 'string' })
  taskId: string | null;

  @ApiProperty({ example: '2025-12-30T09:00:00.000Z' })
  createdAt: Date;
}
