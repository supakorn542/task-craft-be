import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserEntity): Promise<AuthEntity> {
    const accessToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '60m' },
    );
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    return user;
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);
      const newAccessToken = this.jwtService.sign(
        { userId: payload.userId },
        { expiresIn: '60m' },
      );
      return newAccessToken;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
