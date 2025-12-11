import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { TagResponseDto } from 'src/modules/tag/dto/tag.dto';

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

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];
}
