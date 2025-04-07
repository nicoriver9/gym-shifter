// src/packs/packs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackDto} from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo pack
  async createPack(data: CreatePackDto) {
    return this.prisma.pack.create({ data });
  }

  // Crear múltiples packs
  async createMultiplePacks(data: CreatePackDto[]) {
    return this.prisma.pack.createMany({
      data,
      skipDuplicates: true, // Evita duplicados si algún pack ya existe
    });
  }

  // Obtener todos los packs
  async getAllPacks() {
    return this.prisma.pack.findMany({
      where:{
        isDeleted: false
      }
    });
  }

  // Obtener un pack por ID
  async getPackById(id: number) {
    return this.prisma.pack.findUnique({
      where: { id },
    });
  }

  // Actualizar un pack
  async updatePack(id: number, data: UpdatePackDto) {
    return this.prisma.pack.update({
      where: { id },
      data,
    });
  }

  // Eliminar un pack
  async deletePack(id: number) {
    return this.prisma.pack.update({
      where: { id },
      data: {
        isDeleted: true, 
      },
    });
  }
}