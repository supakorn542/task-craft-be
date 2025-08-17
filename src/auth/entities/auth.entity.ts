import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request } from 'express';

export class AuthEntity {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}


export interface AuthRequest extends Request {
  user: UserEntity;
}