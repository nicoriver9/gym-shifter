// src/packs/dto/update-pack.dto.ts
export class UpdatePackDto {
    name?: string;
    classes_included?: number;
    price?: number;
    validity_days?: number;
    unlimited_classes?: boolean;
  }