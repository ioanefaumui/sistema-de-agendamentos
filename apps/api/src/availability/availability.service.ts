// src/availability/availability.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailability(serviceId: string, date: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Cria os horários de início e fim em UTC
    const workingStart = dayjs.utc(`${date}T${service.startTime}`);
    const workingEnd = dayjs.utc(`${date}T${service.endTime}`);

    if (!workingStart.isValid() || !workingEnd.isValid()) {
      throw new Error('Horários de funcionamento inválidos');
    }

    // Busca os agendamentos existentes no período
    const appointments = await this.prisma.appointment.findMany({
      where: {
        serviceId,
        appointmentTime: {
          gte: workingStart.toDate(),
          lt: workingEnd.toDate(),
        },
      },
    });

    // Converte os horários dos agendamentos para UTC no formato "HH:mm:ss"
    const bookedSlots = appointments.map((app) =>
      dayjs.utc(app.appointmentTime).format('HH:mm:ss'),
    );

    const availableSlots: { start: string; end: string }[] = [];
    let slotStart = workingStart;
    while (
      slotStart.add(service.duration, 'minute').isSameOrBefore(workingEnd)
    ) {
      const slotEnd = slotStart.add(service.duration, 'minute');
      const slotStartFormatted = slotStart.format('HH:mm:ss');
      if (!bookedSlots.includes(slotStartFormatted)) {
        availableSlots.push({
          start: slotStartFormatted,
          end: slotEnd.format('HH:mm:ss'),
        });
      }
      slotStart = slotEnd;
    }

    return {
      service: service.name,
      date,
      availableSlots,
    };
  }
}
