import { PartialType } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskRequestDto) {}
