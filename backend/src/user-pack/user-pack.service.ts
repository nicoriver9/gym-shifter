// src/services/user-pack.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPackService {
  constructor(
    private prisma: PrismaService    
  ) {}

  // src/user-pack/user-pack.service.ts
  async confirmClassAttendance(userId: number, currentDateTime: Date) {
    return await this.prisma.$transaction(async (prisma) => {
      // 1. Encontrar la clase actual
      const currentClass = await this.findCurrentClass(currentDateTime);
      if (!currentClass) {
        throw new Error(`No hay clases programadas en este horario ${currentDateTime}`);
      }

      // 2. Obtener información de la clase
      const classInfo = {
        name: currentClass.classType.name,
        teacher: currentClass.teacher.name,
        start_time: currentClass.start_time,
        end_time: currentClass.end_time,
        room: currentClass.room,
      };

      
      // 3. Verificar si el usuario ya asistió
      const existingAttendance = await prisma.reservation.findFirst({
        where: {
          user_id: userId,
          class_id: currentClass.id,
          status: 'confirmed',
        },
      });
      
      // console.log('existingAttendance', existingAttendance)

      if (existingAttendance) {
        // Obtener el usuario sin descontar clases
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { current_pack: true },
        });

        return {
          user,
          classInfo,
          isNewConfirmation: false,
        };
      }


      // 4. Descontar clase y registrar asistencia
      const user = await this.decrementUserClasses(userId, 1);
      const createdAt = new Date();      
      await prisma.reservation.create({
        data: {
          user_id: userId,
          class_id: currentClass.id,
          status: 'confirmed',
          created_at: createdAt
        },
      });

      return {
        user,
        classInfo,
        isNewConfirmation: true,
      };
    });
  }

  private async findCurrentClass(currentTime: Date) {
    const currentDay = currentTime.getDay(); // 0 (Dom) a 6 (Sáb)
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
    // Buscar clases del día actual
    const classes = await this.prisma.classSchedule.findMany({
      where: {
        day_of_week: currentDay,
      },
      include: {
        classType: true,
        teacher: true,
      },
    });
  
    // Filtrar clases que empiezan dentro de los próximos 60 minutos
    const upcomingClass = classes.find((cls) => {
      const [startHour, startMin] = cls.start_time.split(':').map(Number);
      const classStartMinutes = startHour * 60 + startMin;
  
      const diffMinutes = classStartMinutes - currentMinutes;
  
      return diffMinutes > 0 && diffMinutes <= 60;
    });
  
    return upcomingClass || null;
  }
  

  async decrementUserClasses(userId: number, decrementBy: number = 1) {
    return await this.prisma.$transaction(async (prisma) => {
      // 1. Obtener el usuario con su pack actual
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          current_pack: true,
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Verificar si tiene un pack asignado
      if (!user.current_pack) {
        throw new Error('El usuario no tiene ningún pack asignado');
      }

      // 3. Verificar si es un pase ilimitado
      if (user.current_pack.unlimited_classes) {
        return user; // No hacemos nada con pases ilimitados
      }

      // 4. Verificar que tenga clases suficientes
      if (user.classes_remaining < decrementBy) {
        throw new Error('No tiene suficientes clases disponibles');
      }

      // 5. Verificar que el pack no esté expirado
      if (user.pack_expiration_date && user.pack_expiration_date < new Date()) {
        throw new Error('El pack ha expirado');
      }

      // 6. Actualizar el contador de clases del usuario
      return await prisma.user.update({
        where: { id: userId },
        data: {
          classes_remaining: {
            decrement: decrementBy,
          },
        },
        include: {
          current_pack: true,
        },
      });
    });
  }

  async assignPackToUser(userId: number, packId: number) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new Error('Pack no encontrado');
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + pack.validity_days);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        current_pack_id: packId,
        classes_remaining: pack.unlimited_classes
          ? 9999
          : pack.classes_included,
        pack_expiration_date: expirationDate,
      },
      include: {
        current_pack: true,
      },
    });
  }

  async removeUserPack(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        current_pack_id: null,
        classes_remaining: 0,
        pack_expiration_date: null,
      },
    });
  }

  async assignSinglePackToUser(userId: number, packId: number) {
    // Verificar si el usuario ya tiene un pack asignado
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { packs: true }, // Incluir los packs del usuario
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
  
    // if (user.packs.length > 0) {
    //   throw new BadRequestException('El usuario ya tiene un pack asignado.');
    // }
  
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new Error('Pack no encontrado');
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + pack.validity_days);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        current_pack_id: packId,
        classes_remaining: pack.unlimited_classes ? 9999 : pack.classes_included,
        pack_expiration_date: expirationDate,
      },
      include: {
        current_pack: true,
      },
    });
  }

    /**
   * Cancela la asistencia de un usuario a una clase
   * Solo si faltan al menos 10 minutos antes del inicio.
   */
    async cancelClassAttendance(
      userId: number,
      classId: number,
      currentTime: Date,
    ) {
      // 1) Traer la clase por ID
      const cls = await this.prisma.classSchedule.findUnique({
        where: { id: classId },
      });
      if (!cls) throw new Error('Clase no encontrada');
  
      // 2) Calcular diferencia en minutos
      const [h, m] = cls.start_time.split(':').map(Number);
      const start = new Date(currentTime);
      start.setHours(h, m, 0, 0);
  
      const diffMin = Math.floor((start.getTime() - currentTime.getTime()) / 60000);
      if (diffMin < 10) {
        throw new Error(
          'Ya no puedes cancelar; faltan menos de 10 minutos para iniciar.'
        );
      }
  
      // 3) Verificar reserva confirmada
      const reservation = await this.prisma.reservation.findFirst({
        where: {
          user_id: userId,
          class_id: classId,
          status: 'confirmed',
        },
      });
      if (!reservation) {
        throw new Error('No tienes una reserva confirmada para esta clase.');
      }
  
      // 4) Eliminar la reserva
      await this.prisma.reservation.delete({
        where: { id: reservation.id },
      });
  
      // 5) Revertir el descuento (si no es ilimitado)
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { current_pack: true },
      });
      if (user?.current_pack && !user.current_pack.unlimited_classes) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { classes_remaining: { increment: 1 } },
        });
      }
  
      return { message: 'Asistencia cancelada correctamente' };
    }
  
  

  // @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // async resetWeeklyClasses() {
  //   const today = new Date();

  //   // Obtener usuarios con pack limitado (no ilimitado) y activo
  //   const users = await this.prisma.user.findMany({
  //     where: {
  //       current_pack_id: { not: null },
  //       pack_expiration_date: { gt: today },
  //       NOT: {
  //         current_pack: {
  //           unlimited_classes: true,
  //         },
  //       },
  //     },
  //     include: {
  //       current_pack: true,
  //     },
  //   });

  //   for (const user of users) {
  //     const lastReset = user.last_class_reset ?? user.createdAt;

  //     const diffInDays = Math.floor(
  //       (today.getTime() - new Date(lastReset).getTime()) / (1000 * 60 * 60 * 24)
  //     );

  //     if (diffInDays >= 7) {
  //       // Reiniciar clases semanales
  //       await this.prisma.user.update({
  //         where: { id: user.id },
  //         data: {
  //           classes_remaining: user.current_pack?.classes_included || 0,
  //           last_class_reset: today,
  //         },
  //       });

  //       console.log(`🔁 Clases reiniciadas para el usuario ${user.email}`);
  //     }
  //   }
  // }

  // async forceResetWeeklyClasses() {
  //   await this.resetWeeklyClasses(); // Llama directamente al cron interno
  //   return { message: 'Reinicio manual de clases semanales ejecutado.' };
  // }

}
