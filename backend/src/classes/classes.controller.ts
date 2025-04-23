import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('classes')
export class ClassesController {
  constructor(    
    private readonly classesService: ClassesService
  ) {}

  /**
   * Crear una nueva clase en el calendario.
   * Se debe enviar `class_type_id`, `day_of_week`, `start_time`, `end_time`, y `teacher_id`.
   */
  @Roles(Role.Admin)
  @Post()
  create(@Body() data) {
    return this.classesService.createClass(data);
  }

  @Roles(Role.Admin)
  @Get('current')
  async getCurrentClass() {
    try {
      const currentClass = await this.classesService.getCurrentClass();
      // console.log(currentClass)      
      return {
        success: true,
        data: currentClass,
        message: currentClass.is_active 
          ? 'Clase en curso encontrada' 
          : 'No hay clases en curso'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }
  
  @Roles(Role.Admin)
  @Get()
  getAll() {
    return this.classesService.getAllClasses();
  }
  
  @Roles(Role.Admin)
  @Get('by-day/:day')
  getByDay(@Param('day') day: number) {
    return this.classesService.getClassesByDay(day);
  }

  @Roles(Role.Admin)
  @Post('bulk')
  async createMultipleClasses(@Body() classes: any[]) {    
    return this.classesService.createMultipleClasses(classes);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async updateClass(@Param('id') id: string, @Body() data: any) {
    return this.classesService.updateClass(Number(id), data);
  }

  @Roles(Role.Admin)
  @Delete('delete-by-schedule')
  async deleteClassBySchedule(
    @Query('class_type_id') classTypeId: string,
    @Query('day_of_week') dayOfWeek: string,
    @Query('start_time') startTime: string,
    @Query('end_time') endTime: string,
  ) {
    return this.classesService.deleteClassBySchedule(
      Number(classTypeId),
      parseInt(dayOfWeek),
      startTime,
      endTime,
    );
  }
}
