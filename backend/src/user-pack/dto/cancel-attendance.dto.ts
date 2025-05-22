// src/user-pack/dto/cancel-attendance.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelAttendanceDto {
  @IsInt()              @IsNotEmpty()
  userId: number;

  @IsInt()              @IsNotEmpty()
  classId: number;

  @IsNotEmpty()
  currentDateTime: string;  // ISO string
}
