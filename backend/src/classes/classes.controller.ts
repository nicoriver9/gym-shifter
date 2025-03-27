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

@Controller('classes')
export class ClassesController {
  constructor(    
    private readonly classesService: ClassesService
  ) {}

  /**
   * Crear una nueva clase en el calendario.
   * Se debe enviar `class_type_id`, `day_of_week`, `start_time`, `end_time`, y `teacher_id`.
   */
  @Post()
  create(@Body() data) {
    return this.classesService.createClass(data);
  }

  @Get('current')
  async getCurrentClass() {
    try {
      const currentClass = await this.classesService.getCurrentClass();
      
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
  
  /**
   * Obtener todas las clases en el calendario.
   * Incluye información del tipo de clase (`classType`) y del profesor (`teacher`).
   */
  @Get()
  getAll() {
    return this.classesService.getAllClasses();
  }
  
  /**
   * Obtener clases de un día específico.
   */
  @Get('by-day/:day')
  getByDay(@Param('day') day: number) {
    return this.classesService.getClassesByDay(day);
  }

  /**
   * Crear múltiples clases en el calendario.
   * Se debe enviar un array con `class_type_id`, `day_of_week`, `start_time`, `end_time`, y `teacher_id`.
   */
  @Post('bulk')
  async createMultipleClasses(@Body() classes: any[]) {    
    return this.classesService.createMultipleClasses(classes);
  }

  /**
   * Actualizar una clase en el calendario.
   */
  @Put(':id')
  async updateClass(@Param('id') id: string, @Body() data: any) {
    return this.classesService.updateClass(Number(id), data);
  }

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
