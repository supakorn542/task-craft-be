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
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { GetTagListResponseDto } from './dto/get-tag-list.dto';
import {
  CreateTagRequestDto,
  CreateTagResponseDto,
} from './dto/create-tag.dto';
import {
  UpdateTagRequestDto,
  UpdateTagResponseDto,
} from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    type: [GetTagListResponseDto],
    description: 'Get tag list for the current user',
  })
  async getTags(@Req() req): Promise<GetTagListResponseDto[]> {
    const userId = req.user.id;
    return this.tagService.getTagList(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 200,
    type: CreateTagResponseDto,
    description: 'Tag successfully created',
  })
  async createTag(
    @Req() req,
    @Body() dto: CreateTagRequestDto,
  ): Promise<CreateTagResponseDto> {
    const userId = req.user.id;
    return this.tagService.createTag(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: UpdateTagResponseDto,
    description: 'Tag successfully updated',
  })
  async updateTag(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateTagRequestDto,
  ): Promise<UpdateTagResponseDto> {
    const userId = req.user.id;
    return this.tagService.updateTag(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: TagResponseDto,
    description: 'Tag successfully deleted',
  })
  async deleteTag(
    @Param('id') id: string,
    @Req() req,
  ): Promise<TagResponseDto> {
    const userId = req.user.id;
    return this.tagService.deleteTag(id, userId);
  }
}
