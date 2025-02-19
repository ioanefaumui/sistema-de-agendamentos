import { Injectable } from '@nestjs/common';
import { Service as ServiceModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPaginated(page: number, limit: number): Promise<ServiceModel[]> {
    const skip = (page - 1) * limit;
    return this.prisma.service.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateServiceDto): Promise<ServiceModel> {
    const startTimeUtc = dayjs(data.startTime).utc().toDate();
    const endTimeUtc = dayjs(data.endTime).utc().toDate();

    return this.prisma.service.create({
      data: {
        ...data,
        startTime: startTimeUtc,
        endTime: endTimeUtc,
      },
    });
  }

  async update(
    id: string,
    updateData: UpdateServiceDto,
  ): Promise<ServiceModel> {
    let startTimeUtc: Date | undefined;
    let endTimeUtc: Date | undefined;

    if (updateData.startTime) {
      startTimeUtc = dayjs(updateData.startTime).utc().toDate();
    }
    if (updateData.endTime) {
      endTimeUtc = dayjs(updateData.endTime).utc().toDate();
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        ...(startTimeUtc && { startTime: startTimeUtc }),
        ...(endTimeUtc && { endTime: endTimeUtc }),
      },
    });
  }

  async remove(id: string): Promise<ServiceModel> {
    await this.prisma.appointment.deleteMany({
      where: { serviceId: id },
    });

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
