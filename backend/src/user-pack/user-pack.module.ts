// src/modules/user-pack.module.ts
import { Module } from '@nestjs/common';
import { UserPackService } from './user-pack.service';
import { UserPackController } from './user-pack.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UserPackService, PrismaService],
  controllers: [UserPackController],
})
export class UserPackModule {}