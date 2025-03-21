import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { PacksModule } from './packs/packs.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassTypeController } from './class-type/class-type.controller';
import { ClassTypeService } from './class-type/class-type.service';
import { ClassTypeModule } from './class-type/class-type.module';
import { UsersService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // Cargar variables de entorno
    AuthModule,
    PrismaModule,
    ClassesModule,
    PacksModule,
    ReservationsModule,
    TeachersModule,
    ClassTypeModule,
    UserModule,
    PaymentsModule,
  ],
  controllers: [AppController, ClassTypeController],
  providers: [AppService, ClassTypeService, UsersService],
})
export class AppModule {}
