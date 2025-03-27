// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ConsoleLogger,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crear un nuevo usuario
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  // Obtener todos los usuarios
  @Get()
  async getAll() {
    const result = await this.usersService.getAllUsers()    
    return this.usersService.getAllUsers();
  }

  // Obtener un usuario por ID
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.usersService.getUserById(Number(id));
  }

  // Actualizar un usuario
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), data);
  }

  // Eliminar un usuario
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  // Asignar un pack a un usuario  
  @Post(':userId/packs/:packId')
  async assignPack(
    @Param('userId') userId: string,
    @Param('packId') packId: string,
  ) {
    return this.usersService.assignPackToUser(Number(userId), Number(packId));
  }

  // Desasignar un pack de un usuario
  @Delete(':userId/packs/:packId')
  async unassignPack(
    @Param('userId') userId: string,
    @Param('packId') packId: string,
  ) {
    return this.usersService.unassignPackFromUser(
      Number(userId),
      Number(packId),
    );
  }
}
