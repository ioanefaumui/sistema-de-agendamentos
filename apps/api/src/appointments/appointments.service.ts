import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

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

  async createAppointment(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const { serviceId, appointmentTime } = createAppointmentDto;

    const appointmentDate = dayjs(appointmentTime).utc();

    if (appointmentDate.isBefore(dayjs().utc())) {
      throw new BadRequestException(
        'Não é possível agendar um horário no passado',
      );
    }

    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        serviceId,
        appointmentTime: appointmentDate.toDate(),
      },
    });
    if (conflictingAppointment) {
      throw new BadRequestException(
        'Este horário já está reservado para o serviço',
      );
    }

    return this.prisma.appointment.create({
      data: {
        userId,
        serviceId,
        appointmentTime: appointmentDate.toDate(),
      },
    });
  }
}
