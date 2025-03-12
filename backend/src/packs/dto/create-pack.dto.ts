// src/packs/dto/create-pack.dto.ts
export class CreatePackDto {
    name: string;
    classes_included: number;
    price: number;
    validity_days: number;
    unlimited_classes?: boolean;
  }