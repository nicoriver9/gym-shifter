import { Module } from '@nestjs/common';
import { ClassTypeController } from './class-type.controller';
import { ClassTypeService } from './class-type.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [ClassTypeService, PrismaService],
  controllers: [ClassTypeController],
  exports:[PrismaService]
})
export class ClassTypeModule {}
