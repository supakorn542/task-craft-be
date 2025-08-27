
import { User } from '@prisma/client';
import { Request } from 'express';

export class AuthEntity {
  accessToken: string;

  refreshToken: string;
}

export interface AuthRequest extends Request {
  user: User;
}
