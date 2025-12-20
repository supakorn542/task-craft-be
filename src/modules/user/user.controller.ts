import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, UserResponseDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201,type: UserResponseDto, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    const user = await this.userService.create(dto);
    return new UserResponseDto(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'user data returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'updated profile successfully',
  })
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'change password successfully',
  })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, dto);
  }
}
