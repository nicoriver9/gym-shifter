// src/users/dto/create-user.dto.ts
import { Role } from '@prisma/client'; // Importa el Enum desde Prisma

export interface CreateUserDto {
  username?: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string; 
  role?: Role;
}