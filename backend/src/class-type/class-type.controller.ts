import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClassTypeService } from './class-type.service';

@Controller('class-types')
export class ClassTypeController {
  constructor(private readonly classTypeService: ClassTypeService) {}

  @Post()
  async createClassType(@Body() data: any) {
    return this.classTypeService.createClassType(data);
  }

  @Post('bulk')
  async createMultipleClassTypes(@Body() data: any[]) {
    return this.classTypeService.createMultipleClassTypes(data);
  }

  @Get(':id')
  getById(@Param('id') id: string,) {
    return this.classTypeService.getClassTypeById(Number(id));
  }


  @Get()
  async getAllClassTypes() {
    return this.classTypeService.getAllClassTypes();
  }

  @Put(':id')
  async updateClassType(@Param('id') id: string, @Body() data: any) {
    return this.classTypeService.updateClassType(Number(id), data);
  }

  @Delete(':id')
  async deleteClassType(@Param('id') id: string) {
    return this.classTypeService.deleteClassType(Number(id));
  }
}
