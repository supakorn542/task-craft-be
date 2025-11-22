import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { TagRepository } from './repositories/tag.repository';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
  imports: [PrismaModule],
  exports: [TagService],
})
export class TagModule {}
