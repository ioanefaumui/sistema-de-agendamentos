// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { Service } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPaginated(page: number, limit: number): Promise<Service[]> {
    const skip = (page - 1) * limit;
    return this.prisma.service.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({ data });
  }
}
