// src/dto/update-classes-included.dto.ts
export class UpdateClassesIncludedDto {
    readonly userId: number;
    readonly decrementBy?: number = 1; // Por defecto descuenta 1 clase
  }