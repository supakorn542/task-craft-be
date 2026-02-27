import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { DemoResetService } from './demo-reset.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DemoResetService],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
