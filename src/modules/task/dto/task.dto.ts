import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { TagResponseDto } from 'src/tag/dto/tag.dto';

export class TaskResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Finish project report' })
  title: string;

  @ApiProperty({
    example: 'Complete the final report by Friday',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TO_DO })
  status: TaskStatus;

  @ApiProperty({
    example: '2025-09-01T12:00:00Z',
    required: false,
    nullable: true,
  })
  dueDate?: Date;

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    example: '2025-09-02T10:00:00Z',
    required: false,
    nullable: true,
    description: 'Timestamp when the task was soft-deleted',
  })
  deletedAt?: Date;
}
