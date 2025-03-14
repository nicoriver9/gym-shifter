// src/payments/dto/create-payment.dto.ts
import { IsInt, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsPositive()
  userId: number; // ID del usuario

  @IsInt()
  @IsPositive()
  packId: number; // ID del pack
}