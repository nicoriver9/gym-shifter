import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear una nueva clase en el calendario (horario específico).
   * `data` debe incluir `class_type_id`, `day_of_week`, `start_time`, `end_time`, y `teacher_id`.
   */
  async createClass(data) {
    return this.prisma.classSchedule.create({ data });
  }

  /**
   * Obtener todas las clases con información del tipo de clase y el profesor.
   */
  async getAllClasses() {
    return this.prisma.classSchedule.findMany({
      include: { classType: true, teacher: true }, // 🔥 Traemos info del tipo de clase y del profesor
    });
  }

  /**
   * Obtener clases filtradas por día de la semana.
   */
  async getClassesByDay(day: number) {
    return this.prisma.classSchedule.findMany({
      where: { day_of_week: Number(day) },
      include: { classType: true, teacher: true }, // 🔥 Incluimos info del tipo de clase y profesor
    });
  }

  /**
   * Crear múltiples clases en el calendario de una sola vez.
   */
  async createMultipleClasses(classes: any[]) {
    try {
      const createdClasses = await this.prisma.classSchedule.createMany({
        data: classes,
        skipDuplicates: true, // Evita duplicados en caso de datos repetidos
      });

      return {
        message: 'Clases insertadas correctamente',
        count: createdClasses.count,
      };
    } catch (error) {
      return { error: 'Error al insertar las clases', details: error.message };
    }
  }

  /**
   * Actualizar una clase en el calendario.
   */
  async updateClass(id: number, data: any) {
    return this.prisma.classSchedule.update({
      where: { id },
      data,
    });
  }

  /**
   * Eliminar una clase específica por su ID.
   */
  async deleteClass(id: number) {
    return this.prisma.classSchedule.delete({
      where: { id },
    });
  }

  /**
   * Eliminar una clase específica por `class_type_id`, `day_of_week` y `start_time`.
   */
  async deleteClassBySchedule(classTypeId: number, dayOfWeek: number, startTime: string, endTime: string) {
    return this.prisma.classSchedule.deleteMany({
      where: {
        class_type_id: classTypeId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      },
    });
  }
}
