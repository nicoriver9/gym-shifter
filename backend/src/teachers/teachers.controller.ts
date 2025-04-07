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
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // Crear un nuevo profesor
  @Roles(Role.Admin)
  @Post()
  create(@Body() data) {
    return this.teachersService.createTeacher(data);
  }

  @Roles(Role.Admin)
  @Get()
  getAll() {
    return this.teachersService.getAllTeachers();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return teacher;
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return this.teachersService.updateTeacher(Number(id), data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const teacher = await this.teachersService.getTeacherById(Number(id));
    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }
    return this.teachersService.deleteTeacher(Number(id));
  }
}