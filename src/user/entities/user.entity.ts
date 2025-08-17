import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  userName: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

//   @ApiProperty({
//     type: () => [TaskEntity], 
//     description: 'List of tasks associated with the user',
//     required: false,
//   })
//   tasks?: any[]; 

  @ApiProperty()
  createdAt: Date;
}
