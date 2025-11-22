import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTagRequestDto } from '../dto/create-tag.dto';
import { UpdateTagRequestDto } from '../dto/update-tag.dto';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    return this.prisma.tag.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async create(userId: string, tagData: CreateTagRequestDto) {
    return this.prisma.tag.create({
      data: {
        name: tagData.name,
        color: tagData.color,
        userId: userId,
      },
    });
  }

  async update(id: string, userId: string, tagData: UpdateTagRequestDto) {
    const existingTag = await this.prisma.tag.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return this.prisma.tag.update({
      where: {
        id: id,
      },
      data: {
        color: tagData.color,
        name: tagData.name,
      },
    });
  }

  async delete(id: string, userId: string) {
    const existingTag = await this.prisma.tag.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return this.prisma.tag.delete({
      where: {
        id: id,
      },
    });
  }
}
