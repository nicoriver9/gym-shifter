// src/users/dto/create-user.dto.ts
export class CreateUserDto {
    email: string;
    password?: string; // Opcional para usuarios de Google
    googleId?: string; // Opcional para usuarios tradicionales
    firstName: string;
    lastName: string;
  }