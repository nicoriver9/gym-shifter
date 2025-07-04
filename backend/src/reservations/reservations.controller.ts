// src/reservations/reservations.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Crear una reservación
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateReservationDto) {
    return this.reservationsService.createReservation(data);
  }

  // Obtener todas las reservaciones
  @Roles(Role.Admin, Role.Instructor)
  @Get()
  async getAll() {
    return this.reservationsService.getAllReservations();
  }

  // Obtener una reservación por ID
  @Roles(Role.Admin, Role.Instructor)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const reservation = await this.reservationsService.getReservationById(Number(id));
    if (!reservation) {
      throw new NotFoundException(`Reservación con ID ${id} no encontrada`);
    }
    return reservation;
  }

  // Actualizar el estado de una reservación
  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateReservationDto) {
    const reservation = await this.reservationsService.getReservationById(Number(id));
    if (!reservation) {
      throw new NotFoundException(`Reservación con ID ${id} no encontrada`);
    }
    return this.reservationsService.updateReservation(Number(id), data);
  }

  // Eliminar una reservación
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const reservation = await this.reservationsService.getReservationById(Number(id));
    if (!reservation) {
      throw new NotFoundException(`Reservación con ID ${id} no encontrada`);
    }
    return this.reservationsService.deleteReservation(Number(id));
  }
}