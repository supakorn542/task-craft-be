import { ApiProperty } from '@nestjs/swagger';

class TagCountDto {
  @ApiProperty({ example: 10 })
  tasks: number;
}

export class GetTagListResponseDto {
  @ApiProperty({ example: 'c7a9a7a9-b8f0-4f3a-9c7b-1e2d3f4a5b6c' })
  id: string;

  @ApiProperty({ example: 'Urgent' })
  name: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;

  @ApiProperty({ type: TagCountDto })
  _count: TagCountDto;
}
