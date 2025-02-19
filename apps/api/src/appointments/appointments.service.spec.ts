// appointments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    appointment: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserIdPaginated', () => {
    it('should return appointments for a given user with proper query parameters', async () => {
      const userId = 'user123';
      const page = 1;
      const limit = 10;
      const fakeAppointments = [
        {
          id: '1',
          userId,
          serviceId: 'service1',
          appointmentTime: new Date(),
          createdAt: new Date(),
          service: { name: 'Service A', price: 10 },
        },
      ];

      mockPrisma.appointment.findMany.mockResolvedValue(fakeAppointments);

      const result = await service.findByUserIdPaginated(userId, page, limit);

      expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: limit,
        orderBy: { appointmentTime: 'asc' },
        include: {
          service: {
            select: { name: true, price: true },
          },
        },
      });
      expect(result).toEqual(fakeAppointments);
    });
  });

  describe('createAppointment', () => {
    const userId = 'user123';
    const serviceId = 'service123';
    const futureTime = dayjs().utc().add(1, 'hour').toISOString();
    const createAppointmentDto = { serviceId, appointmentTime: futureTime };

    it('should create an appointment if no conflict exists and time is valid', async () => {
      mockPrisma.appointment.findFirst.mockResolvedValue(null);
      const createdAppointment = {
        id: 'appointment1',
        userId,
        serviceId,
        appointmentTime: dayjs(futureTime).toDate(),
        createdAt: new Date(),
      };
      mockPrisma.appointment.create.mockResolvedValue(createdAppointment);

      const result = await service.createAppointment(
        userId,
        createAppointmentDto,
      );

      expect(mockPrisma.appointment.findFirst).toHaveBeenCalledWith({
        where: {
          serviceId,
          appointmentTime: dayjs(futureTime).utc().toDate(),
        },
      });
      expect(mockPrisma.appointment.create).toHaveBeenCalled();
      expect(result).toEqual(createdAppointment);
    });

    it('should throw an error if the appointment time is in the past', async () => {
      const pastTime = dayjs().utc().subtract(1, 'hour').toISOString();
      const dtoPast = { serviceId, appointmentTime: pastTime };

      await expect(service.createAppointment(userId, dtoPast)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if a conflicting appointment exists', async () => {
      const conflictingAppointment = {
        id: 'conflict1',
        userId: 'other',
        serviceId,
        appointmentTime: dayjs(futureTime).utc().toDate(),
        createdAt: new Date(),
      };
      mockPrisma.appointment.findFirst.mockResolvedValue(
        conflictingAppointment,
      );

      await expect(
        service.createAppointment(userId, createAppointmentDto),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.appointment.findFirst).toHaveBeenCalled();
    });
  });
});
