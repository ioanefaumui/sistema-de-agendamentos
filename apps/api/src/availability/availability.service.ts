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

    const serviceStartTimeStr = dayjs.utc(service.startTime).format('HH:mm:ss');
    const serviceEndTimeStr = dayjs.utc(service.endTime).format('HH:mm:ss');

    const workingStart = dayjs.utc(`${date}T${serviceStartTimeStr}`);
    const workingEnd = dayjs.utc(`${date}T${serviceEndTimeStr}`);

    if (!workingStart.isValid() || !workingEnd.isValid()) {
      throw new Error('Horários de funcionamento inválidos');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        serviceId,
        appointmentTime: {
          gte: workingStart.toDate(),
          lt: workingEnd.toDate(),
        },
      },
    });

    const bookedSlots = appointments.map((app) =>
      dayjs.utc(app.appointmentTime).format('HH:mm:ss'),
    );

    const slots: { start: string; end: string; available: boolean }[] = [];
    let currentSlotStart = workingStart;
    while (
      currentSlotStart
        .add(service.duration, 'minute')
        .isSameOrBefore(workingEnd)
    ) {
      const currentSlotEnd = currentSlotStart.add(service.duration, 'minute');
      const slotStartFormatted = currentSlotStart.format('HH:mm:ss');
      const slotEndFormatted = currentSlotEnd.format('HH:mm:ss');

      const isBooked = bookedSlots.includes(slotStartFormatted);

      slots.push({
        start: slotStartFormatted,
        end: slotEndFormatted,
        available: !isBooked,
      });

      currentSlotStart = currentSlotEnd;
    }

    return {
      service: service.name,
      date,
      slots,
    };
  }
}
