// src/teachers/teachers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo profesor
  async createTeacher(data) {
    return this.prisma.teacher.create({ data });
  }

  // Obtener todos los profesores
  async getAllTeachers() {
    return this.prisma.teacher.findMany();
  }

  // Obtener un profesor por ID
  async getTeacherById(id: number) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: { classes: true },
    });
  }

  // Modificar un profesor
  async updateTeacher(id: number, data) {
    return this.prisma.teacher.update({
      where: { id },
      data,
    });
  }

  // Eliminar un profesor
  async deleteTeacher(id: number) {
    // Verificar si el profesor existe
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { classes: true }, // Incluir las clases relacionadas
    });

    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }

    // Desasignar al profesor de las clases
    await this.prisma.classSchedule.updateMany({
      where: { teacher_id: id },
      data: { teacher_id: null }, // Establecer teacher_id como null
    });

    // Eliminar el profesor
    return this.prisma.teacher.delete({
      where: { id },
    });
  }
}