// src/controllers/user-pack.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserPackService } from './user-pack.service';
import { UpdateClassesIncludedDto } from './dto/update-classes-included.dto';
import { ConfirmAttendanceDto } from './dto/confirm-attendance.dto';

@Controller('api/user-pack')
export class UserPackController {
  constructor(
    private prisma: PrismaService,
    private readonly userPackService: UserPackService,
  ) {}

  @Post('decrement-classes')
  async decrementClasses(@Body() updateDto: UpdateClassesIncludedDto) {
    try {
      const result = await this.userPackService.decrementUserClasses(
        updateDto.userId,
        updateDto.decrementBy,
      );
      return {
        success: true,
        data: {
          classes_remaining: result.classes_remaining,
          pack_expiration_date: result.pack_expiration_date,
          pack_name: result.current_pack?.name,
        },
        message: 'Clases descontadas correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('confirm-attendance')
  async confirmAttendance(@Body() confirmDto: ConfirmAttendanceDto) {
    try {
      const currentDateTime = new Date(confirmDto.currentDateTime);
      const result = await this.userPackService.confirmClassAttendance(
        confirmDto.userId,
        currentDateTime,
      );

      const response = {
        success: true,
        data: {
          classes_remaining: result.user.classes_remaining,
          pack_name: result.user.current_pack?.name,
          pack_expiration_date: result.user.pack_expiration_date,
          class_name: result.classInfo.name,
          teacher_name: result.classInfo.teacher,
          class_time: `${result.classInfo.start_time} - ${result.classInfo.end_time}`,
          room: result.classInfo.room,
          is_new_confirmation: result.isNewConfirmation,
        },
      };

      // Mensaje personalizado según si es nueva confirmación o no
      if (result.isNewConfirmation) {
        response['message'] = 'Asistencia confirmada correctamente';
      } else {
        response['message'] = 'Ya habías confirmado asistencia a esta clase';
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('single/:userId/pack')
  async assignSinglePack(
    @Param('userId') userId: string,
    @Body() body: { packId: number }, // Recibimos el packId en el body
  ) {
    try {
      const result = await this.userPackService.assignSinglePackToUser(
        parseInt(userId),
        body.packId,
      );      
      return {
        success: true,
        data: result,
        message: 'Pack asignado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('assign-pack/:userId/:packId')
  async assignPack(
    @Param('userId') userId: string,
    @Param('packId') packId: string,
  ) {
    try {
      const result = await this.userPackService.assignPackToUser(
        parseInt(userId),
        parseInt(packId),
      );
      return {
        success: true,
        data: result,
        message: 'Pack asignado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('info/:userId')
  async getUserPackInfo(@Param('userId') userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
          current_pack: true,
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: {
          pack_name: user.current_pack?.name,
          classes_remaining: user.classes_remaining,
          expiration_date: user.pack_expiration_date,
          is_unlimited: user.current_pack?.unlimited_classes || false,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('remove-pack/:userId')
  async removePack(@Param('userId') userId: string) {
    try {
      const result = await this.userPackService.removeUserPack(
        parseInt(userId),
      );
      return {
        success: true,
        data: result,
        message: 'Pack desasignado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

}
