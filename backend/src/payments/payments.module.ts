import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserPackService } from '../user-pack/user-pack.service';


@Module({
  providers: [PaymentsService, PrismaService, UserPackService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
