// src/users/users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo usuario
  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,        
        current_pack: true,   // Pack activo actual
        classes_remaining: true,
        reservations: true,        
      },
    });
  }

  // Obtener un usuario por ID
  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { 
        current_pack: true,                
        reservations: true }, // Incluir packs y reservas
    });
  }

  // Actualizar un usuario
  async updateUser(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Eliminar un usuario
  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Buscar usuario por email (útil para login)
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Buscar usuario por Google ID (útil para login con Google)
  async findUserByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

   // Asignar un pack a un usuario
   async assignPackToUser(userId: number, packId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new NotFoundException(`Pack con ID ${packId} no encontrado`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        packs: {
          connect: { id: packId },
        },
      },
      include: { packs: true }, // Incluir los packs del usuario en la respuesta
    });
  
  }

  // Desasignar un pack de un usuario
  async unassignPackFromUser(userId: number, packId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const pack = await this.prisma.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new NotFoundException(`Pack con ID ${packId} no encontrado`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        packs: {
          disconnect: { id: packId },
        },
      },
      include: { packs: true }, // Incluir los packs del usuario en la respuesta
    });
  }

  
}