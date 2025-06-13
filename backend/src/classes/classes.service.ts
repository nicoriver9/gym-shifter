import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import moment from 'moment-timezone';

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

  async getCurrentClass() {
    const now = moment().tz('America/Argentina/Buenos_Aires');
    const currentDay = now.isoWeekday();
    const currentTime = now.format('HH:mm');
  
    const currentClass = await this.prisma.classSchedule.findFirst({
      where: {
        day_of_week: currentDay,
        start_time: { lte: currentTime },
        end_time: { gte: currentTime },
      },
      include: {
        classType: true,
        teacher: true,
      },
    });
  
    const baseResponse = {
      id: null,
      name: null,
      start_time: null,
      end_time: null,
      teacher: null,
      attendees_count: 0,
      room: null,
      is_active: false,
      extraData: {
        currentDay,
        currentTime,
      },
    };
  
    if (!currentClass) {
      return baseResponse;
    }
  
    // Calcular límites de tiempo
    const todayStart = now.clone().startOf('day').toDate();
    const classStartDateTime = moment(`${now.format('YYYY-MM-DD')}T${currentClass.start_time}`)
      .tz('America/Argentina/Buenos_Aires')
      .toDate();
  
    // Contar reservas confirmadas para esta clase, hechas antes del inicio
    const confirmedReservationsCount = await this.prisma.reservation.count({
      where: {
        class_id: currentClass.id,
        status: 'confirmed',
        created_at: {
          lte: classStartDateTime,
          gte: todayStart,
        },
      },
    });
  
    return {
      id: currentClass.id,
      name: currentClass.classType.name,
      start_time: currentClass.start_time,
      end_time: currentClass.end_time,
      teacher: currentClass.teacher?.name ?? 'Sin profesor asignado',
      attendees_count: confirmedReservationsCount,
      room: currentClass.room,
      is_active: true,
      extraData: {
        currentDay,
        currentTime,
      },
    };
  }

  async getNextClass(userId?: number) {
    const now = moment().tz('America/Argentina/Buenos_Aires');
    const currentDay = now.isoWeekday(); // 1–7
    const currentTime = now.format('HH:mm');

    // Traer la siguiente clase (hoy > hora o días futuros)
    const candidates = await this.prisma.classSchedule.findMany({
      where: {
        OR: [
          { day_of_week: currentDay, start_time: { gt: currentTime } },
          { day_of_week: { gt: currentDay } },
        ],
      },
      include: { classType: true, teacher: true },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' },
      ],
      take: 1,
    });

    const next = candidates[0];
    if (!next) {
      return { is_upcoming: false, message: 'No hay próximas clases' };
    }

    // Verificar si el user ya confirmó asistencia
    let hasConfirmed = false;
    if (userId) {
      const existing = await this.prisma.reservation.findFirst({
        where: {
          user_id: userId,
          class_id: next.id,
          status: 'confirmed',
        },
      });
      hasConfirmed = !!existing;
    }

    return {
      id: next.id,
      name: next.classType.name,
      day_of_week: next.day_of_week,
      start_time: next.start_time,
      end_time: next.end_time,
      teacher: next.teacher.name,
      room: next.room,
      is_upcoming: true,
      has_confirmed: hasConfirmed,   // ← flag nuevo
    };
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
    // Desestructura sólo los campos válidos
    const {
      class_type_id,   // relación al modelo ClassType
      teacher_id,      // relación al modelo Teacher
      day_of_week,     // 0–6
      start_time,      // "HH:MM"
      end_time,        // "HH:MM"
      room,            // opcional
    } = data;

    return this.prisma.classSchedule.update({
      where: { id },
      data: {
        // actualizamos la relación por connect
        classType: { connect: { id: Number(class_type_id) } },
        teacher:   { connect: { id: Number(teacher_id) } },

        // campos escalares
        day_of_week,
        start_time,
        end_time,

        // sala (si viene)
        ...(room !== undefined ? { room } : {}),
      },
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
  async deleteClassBySchedule(
    classTypeId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ) {
    // 1. Buscar las clases a eliminar
    const classes = await this.prisma.classSchedule.findMany({
      where: {
        class_type_id: classTypeId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      },
      select: { id: true },
    });
  
    const classIds = classes.map((cls) => cls.id);
  
    // 2. Eliminar reservas asociadas
    await this.prisma.reservation.deleteMany({
      where: { class_id: { in: classIds } },
    });
  
    // 3. Eliminar las clases
    return this.prisma.classSchedule.deleteMany({
      where: { id: { in: classIds } },
    });
  }
  
}
