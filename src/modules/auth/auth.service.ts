import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { roundsOfHashing } from '../user/user.service';
import { GoogleUser } from './dto/google-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(user: User): Promise<AuthEntity> {
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

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Please login with Google for this email.',
      );
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return { message: 'If email exists, reset link sent.' };

    const token = crypto.randomBytes(32).toString('hex');

    const expireIn1Hour = new Date();
    expireIn1Hour.setHours(expireIn1Hour.getHours() + 1);

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken: token,
        resetTokenExpiry: expireIn1Hour,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      from: '"Task Craft" <noreply@taskcraft.com>',
      to: email,
      subject: 'Reset Password Request',
      html: `
        <h3>Reset Password</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Click Here to Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return { message: 'If email exists, reset link sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, roundsOfHashing);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async validateGoogleUser(googleUser: GoogleUser) {
    const { email, firstName, lastName, providerId } = googleUser;

    const displayName = [firstName, lastName].filter(Boolean).join(' ');

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          userName: displayName || email.split('@')[0],
          provider: 'google',
          providerId
        },
      });
    }

    return user;
  }
}
