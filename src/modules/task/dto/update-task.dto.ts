import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './create-task.dto';
import { TaskStatus } from '@prisma/client';
import { TagResponseDto } from 'src/tag/dto/tag.dto';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {}

export class UpdateTaskResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'Finish project report [Updated]' })
  title: string;

  @ApiProperty({
    example: 'Complete the final report by Saturday',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status: TaskStatus;

  @ApiProperty({
    example: '2025-09-02T12:00:00Z',
    required: false,
  })
  dueDate?: Date;

  @ApiProperty({ type: [TagResponseDto] })
  tags: TagResponseDto[];

  @ApiProperty({ example: '2025-08-27T09:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-28T11:00:00Z' })
  updatedAt: Date;
}
