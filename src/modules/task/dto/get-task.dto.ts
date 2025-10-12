import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';


export class GetTaskDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  dueDate?: Date;
}
