// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Buscamos al usuario por nombre de usuario en la base de datos
    const user = await this.prisma.user.findUnique({ where: { username } });

    // Si el usuario no existe o la contraseña es incorrecta
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.user_id };

    // Crear el access_token
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Retornar el access_token, username y role
    return {
      access_token,
      user_id: user.id,
      username: user.username,  // Nombre de usuario
      role: user.role,          // Rol del usuario
    };
  }

  async register(userDto: any) {
    const { username, firstName, lastName, email, password, role } = userDto;

    // Verificar si el usuario o el correo ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Encriptar la contraseña antes de guardar el usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await this.prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    });

    return newUser;
  }
}