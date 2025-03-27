// src/services/user-pack.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPackService {
  constructor(private prisma: PrismaService) {}

  // src/user-pack/user-pack.service.ts
  async confirmClassAttendance(userId: number, currentDateTime: Date) {
    return await this.prisma.$transaction(async (prisma) => {
      // 1. Encontrar la clase actual
      const currentClass = await this.findCurrentClass(currentDateTime);
      if (!currentClass) {
        throw new Error('No hay clases programadas en este horario');
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
      await prisma.reservation.create({
        data: {
          user_id: userId,
          class_id: currentClass.id,
          status: 'confirmed',
          created_at: new Date(),
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
    const currentDay = currentTime.getDay(); // 0 (Domingo) a 6 (Sábado)
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Formatear hora actual para comparación
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Buscar clases que coincidan con el día y horario
    const classes = await this.prisma.classSchedule.findMany({
      where: {
        day_of_week: currentDay,
        start_time: { lte: currentTimeStr },
        end_time: { gte: currentTimeStr },
      },
      include: {
        classType: true,
        teacher: true,
      },
    });

    return classes[0]; // Devolver la primera coincidencia (asumiendo que no hay superposición)
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
}
