import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Appointment[]> {
    const skip = (page - 1) * limit;
    return this.prisma.appointment.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { appointmentTime: 'asc' },
    });
  }
}
