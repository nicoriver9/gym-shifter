// src/reservations/reservations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';


@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  // Crear una reservación
  async createReservation(data: CreateReservationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.user_id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${data.user_id} no encontrado`);
    }

    const classSchedule = await this.prisma.classSchedule.findUnique({
      where: { id: data.class_id },
    });

    if (!classSchedule) {
      throw new NotFoundException(`Clase con ID ${data.class_id} no encontrada`);
    }

    return this.prisma.reservation.create({
      data: {
        user_id: data.user_id,
        class_id: data.class_id,
        status: "pending", // Estado inicial
      },
    });
  }

  // Obtener todas las reservaciones
  async getAllReservations() {
    const reservations = await this.prisma.reservation.findMany({
      include: {
        user: true, // Incluir información del usuario
        classSchedule: {
          include: {
            classType: true, // Incluir información del tipo de clase
            teacher: true, // Incluir información del profesor
          },
        },
      },
    });

    // Formatear la respuesta
    return reservations.map((reservation) => ({
      id: reservation.id,
      user: reservation.user,
      classSchedule: {
        ...reservation.classSchedule,
        day_of_week: this.getDayOfWeekName(reservation.classSchedule.day_of_week), // Nombre del día de la semana
        teacherName: `${reservation.classSchedule.teacher.name}`, // Nombre del profesor
      },
      status: reservation.status,
    }));
  }

  // Función para obtener el nombre del día de la semana
  private getDayOfWeekName(dayOfWeek: number): string {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return days[dayOfWeek] || "Día no válido";
  }

  // Obtener una reservación por ID
  async getReservationById(id: number) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true, // Incluir información del usuario
        classSchedule: true, // Incluir información de la clase
      },
    });
  }

  // Actualizar el estado de una reservación
  async updateReservation(id: number, data: UpdateReservationDto) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: data.status, // Actualizar el estado
      },
    });
  }

  // Eliminar una reservación
  async deleteReservation(id: number) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}