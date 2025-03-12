// src/teachers/teachers.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // Crear un nuevo profesor
  @Post()
  create(@Body() data) {
    return this.teachersService.createTeacher(data);
  }

  // Obtener todos los profesores
  @Get()
  getAll() {
    return this.teachersService.getAllTeachers();
  }

  // Obtener un profesor por ID
  @Get(':id')
  async getById(@Param('id') id: string) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return teacher;
  }

  // Modificar un profesor
  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return this.teachersService.updateTeacher(Number(id), data);
  }

  // Eliminar un profesor
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return this.teachersService.deleteTeacher(Number(id));
  }
}