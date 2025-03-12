import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ClassTypeService {
  constructor(private prisma: PrismaService) {}

  async createClassType(data: any) {
    return this.prisma.classType.create({ data });
  }

  async getClassTypeById(id: number) {
    return this.prisma.classType.findUnique({
      where: { id },
    });
  }

  async getAllClassTypes() {
    return this.prisma.classType.findMany();
  }

  async updateClassType(id: number, data: any) {
    return this.prisma.classType.update({
      where: { id },
      data,
    });
  }

  async deleteClassType(id: number) {
    return this.prisma.classType.delete({
      where: { id },
    });
  }
  
  async createMultipleClassTypes(data: any[]) {
    return this.prisma.classType.createMany({ data, skipDuplicates: true });
  }
}
