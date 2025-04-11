// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Buscamos al usuario por nombre de usuario en la base de datos
    const user = await this.prisma.user.findUnique({ where: { username } });

    // Si el usuario no existe
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Si el usuario no está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario no activo');
    }

    // Si la contraseña es incorrecta
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return user;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id,           // ← importante que sea `id`, no `user_id`
      username: user.username,
      role: user.role,        // ← incluir el rol del usuario
    };

    // Crear el access_token
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Retornar el access_token, username y role
    return {
      access_token,
      firstName: user.firstName,
      lastName: user.lastName,
      user_id: user.id,
      username: user.username,  
      role: user.role,          
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

  async loginWithGoogle(data: {
    email: string;
    google_id: string;
    firstName: string;
    lastName: string;
  }) {
    const { email, google_id, firstName, lastName } = data;

    // Primero, buscar por googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId: google_id },
    });
    
    
    // Si no existe por googleId, buscar por email
    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
      
      // Si existe por email pero no tiene googleId, lo actualizamos
      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: google_id,
            firstName,
            lastName,
          },
        });
      }
    }

    
    // Si no existe ni por googleId ni por email, lo creamos
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          username: email.split('@')[0],
          firstName,
          lastName,
          role: Role.User,
          googleId: google_id,
        },
      });
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta está desactivada.');
    }
    
    // Generar JWT
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
  
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
  
    return {
      access_token,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      user_id: user.id,
      username: user.username,
      role: user.role,
    };
  }
  
}