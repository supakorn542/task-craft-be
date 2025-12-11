import { Injectable } from '@nestjs/common';
import { TagRepository } from './repositories/tag.repository';
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

@Injectable()
export class TagService {
  constructor(private tagRepo: TagRepository) {}

  async getTagList(userId: string): Promise<GetTagListResponseDto[]> {
    return this.tagRepo.findAllByUserId(userId);
  }

  async createTag(
    userId: string,
    tagData: CreateTagRequestDto,
  ): Promise<CreateTagResponseDto> {
    return this.tagRepo.create(userId, tagData);
  }

  async updateTag(
    id: string,
    userId: string,
    tagData: UpdateTagRequestDto,
  ): Promise<UpdateTagResponseDto> {
    return this.tagRepo.update(id, userId, tagData);
  }

  async deleteTag(id: string, userId: string): Promise<TagResponseDto> {
    return this.tagRepo.delete(id, userId);
  }
}
