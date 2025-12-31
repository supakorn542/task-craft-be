import { Controller, Post, Body, Request, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthRequest } from './entities/auth.entity';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiOkResponse({ type: AuthEntity })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);

    res.cookie('AccessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.cookie('RefreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return { message: 'Login successful' };
  }

  @Post('refresh')
  @ApiOkResponse({
    description: 'Generate new access token from refresh token',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.RefreshToken;
    const newAccessToken = await this.authService.refreshToken(refreshToken);
    res.cookie('AccessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
    });
    return { message: 'Token refreshed' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Logout and clear cookies' })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessToken', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('RefreshToken', { httpOnly: true, sameSite: 'lax' });
    return { message: 'Logged out' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    description: 'User is not logged in or token is invalid',
  })
  getProfile(@Req() req: AuthRequest): UserDto {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      userName: user.userName ?? undefined,
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset link' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Set new password with token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
