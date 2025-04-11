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
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';


@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  // Crear un nuevo pack
  @Roles(Role.Admin)
  @Post()
  create(@Body() data: CreatePackDto) {
    return this.packsService.createPack(data);
  }

  @Roles(Role.Admin)
  @Post('bulk')
  createMultiple(@Body() data: CreatePackDto[]) {
    return this.packsService.createMultiplePacks(data);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  getAll() {
    return this.packsService.getAllPacks();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.packsService.getPackById(Number(id));
  }

  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePackDto) {
    return this.packsService.updatePack(Number(id), data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.packsService.deletePack(Number(id));
  }
}