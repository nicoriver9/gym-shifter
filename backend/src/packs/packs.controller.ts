// src/packs/packs.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PacksService } from './packs.service';
import { UpdatePackDto } from './dto/update-pack.dto';
import { CreatePackDto } from './dto/create-pack.dto';


@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  // Crear un nuevo pack
  @Post()
  create(@Body() data: CreatePackDto) {
    return this.packsService.createPack(data);
  }

  // Crear múltiples packs
  @Post('bulk')
  createMultiple(@Body() data: CreatePackDto[]) {
    return this.packsService.createMultiplePacks(data);
  }

  // Obtener todos los packs
  @Get()
  getAll() {
    return this.packsService.getAllPacks();
  }

  // Obtener un pack por ID
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.packsService.getPackById(Number(id));
  }

  // Actualizar un pack
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePackDto) {
    return this.packsService.updatePack(Number(id), data);
  }

  // Eliminar un pack
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.packsService.deletePack(Number(id));
  }
}