import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Decimal } from '@prisma/client/runtime/library';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

describe('AvailabilityService', () => {
  let availabilityService: AvailabilityService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              findUnique: jest.fn(),
            },
            appointment: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    availabilityService = module.get<AvailabilityService>(AvailabilityService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAvailability', () => {
    it('should return available slots if service exists and date is valid', async () => {
      const service = {
        id: '1',
        name: 'Test Service',
        duration: 60,
        price: new Decimal(100),
        startTime: new Date('2023-10-10T08:00:00Z'),
        endTime: new Date('2023-10-10T17:00:00Z'),
      };
      const appointments = [
        {
          id: '1',
          userId: '1',
          serviceId: '1',
          appointmentTime: new Date('2023-10-10T09:00:00Z'),
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: '2',
          serviceId: '1',
          appointmentTime: new Date('2023-10-10T10:00:00Z'),
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(prismaService.service, 'findUnique')
        .mockResolvedValue(service);
      jest
        .spyOn(prismaService.appointment, 'findMany')
        .mockResolvedValue(appointments);

      const result = await availabilityService.getAvailability(
        '1',
        '2023-10-10',
      );
      console.log(result); // Log the result to inspect its structure
      expect(result).toBeDefined();
      expect(result.slots).toBeInstanceOf(Array);
    });

    it('should throw NotFoundException if service is not found', async () => {
      jest.spyOn(prismaService.service, 'findUnique').mockResolvedValue(null);

      await expect(
        availabilityService.getAvailability('1', '2023-10-10'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if working hours are invalid', async () => {
      const service = {
        id: '1',
        name: 'Test Service',
        duration: 60,
        price: new Decimal(100),
        startTime: new Date('invalid-time'),
        endTime: new Date('invalid-time'),
      };
      jest
        .spyOn(prismaService.service, 'findUnique')
        .mockResolvedValue(service);

      await expect(
        availabilityService.getAvailability('1', '2023-10-10'),
      ).rejects.toThrow('Horários de funcionamento inválidos');
    });
  });
});
