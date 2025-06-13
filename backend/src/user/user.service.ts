// src/users/users.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo usuario
  async createUser(data: CreateUserDto) {
    // Verificar si ya existe el usuario por email o username
    const existing = await this.prisma.user.findFirst({
      where: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      },
    });
    
    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña si viene definida
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : null;

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        googleId: true,
        phone: true, 
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        current_pack: true,
        classes_remaining: true,
        pack_expiration_date: true,
        last_class_reset: true,
        reservations: true,
      },
      where: {
        isActive: true,
      },
    });
  }

  // Obtener un usuario por ID
  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
        googleId: true,
        phone: true,
        firstName: true,
        lastName: true,
        current_pack: {
          select: {
            id: true,
            name: true,
            price: true,
            validity_days: true,
          },
        },
        classes_remaining: true,
        pack_expiration_date: true,
        last_class_reset: true,
        reservations: {
          select: {
            id: true,
            status: true,
            reservation_date: true,
            class_id: true,
          },
        },
      },
    });
  }
  

  // Actualizar un usuario
  async updateUser(id: number, data: UpdateUserDto) {
    // Si incluye password, la hasheamos
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.firstName) {
      data.username = data.firstName;
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Eliminar un usuario
  async deleteUser(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
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
