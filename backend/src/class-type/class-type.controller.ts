import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClassTypeService } from './class-type.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('class-types')
export class ClassTypeController {
  constructor(private readonly classTypeService: ClassTypeService) {}

  @Post()
  @Roles(Role.Admin)
  async createClassType(@Body() data: any) {
    return this.classTypeService.createClassType(data);
  }

  @Post('bulk')
  @Roles(Role.Admin)
  async createMultipleClassTypes(@Body() data: any[]) {
    return this.classTypeService.createMultipleClassTypes(data);
  }

  @Get(':id')
  @Roles(Role.Admin)
  getById(@Param('id') id: string,) {
    return this.classTypeService.getClassTypeById(Number(id));
  }

  @Get()
  @Roles(Role.Admin)
  async getAllClassTypes() {
    return this.classTypeService.getAllClassTypes();
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateClassType(@Param('id') id: string, @Body() data: any) {
    return this.classTypeService.updateClassType(Number(id), data);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteClassType(@Param('id') id: string) {
    return this.classTypeService.deleteClassType(Number(id));
  }
}
