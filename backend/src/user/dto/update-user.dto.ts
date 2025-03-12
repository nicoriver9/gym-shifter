// src/users/dto/update-user.dto.ts
export class UpdateUserDto {
    email?: string;
    password?: string; // Opcional para usuarios de Google
    googleId?: string; // Opcional para usuarios tradicionales
    firstName?: string;
    lastName?: string;
  }