import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserRequestDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { userName: dto.userName },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Incorrect old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      dto.newPassword,
      roundsOfHashing,
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }
}
