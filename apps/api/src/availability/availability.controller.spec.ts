import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { NotFoundException } from '@nestjs/common';

describe('AvailabilityController', () => {
  let availabilityController: AvailabilityController;
  let availabilityService: AvailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        {
          provide: AvailabilityService,
          useValue: {
            getAvailability: jest.fn(),
          },
        },
      ],
    }).compile();

    availabilityController = module.get<AvailabilityController>(
      AvailabilityController,
    );
    availabilityService = module.get<AvailabilityService>(AvailabilityService);
  });

  describe('getAvailability', () => {
    it('should return available slots if service exists and date is valid', async () => {
      const result = {
        service: 'Test Service',
        date: '2023-10-10',
        slots: [
          { start: '08:00:00', end: '09:00:00', available: true },
          { start: '09:00:00', end: '10:00:00', available: false },
          { start: '10:00:00', end: '11:00:00', available: false },
          { start: '11:00:00', end: '12:00:00', available: true },
          { start: '12:00:00', end: '13:00:00', available: true },
          { start: '13:00:00', end: '14:00:00', available: true },
          { start: '14:00:00', end: '15:00:00', available: true },
          { start: '15:00:00', end: '16:00:00', available: true },
          { start: '16:00:00', end: '17:00:00', available: true },
        ],
      };
      jest
        .spyOn(availabilityService, 'getAvailability')
        .mockResolvedValue(result);

      expect(
        await availabilityController.getAvailability('1', '2023-10-10'),
      ).toEqual(result);
    });

    it('should throw NotFoundException if service is not found', async () => {
      jest
        .spyOn(availabilityService, 'getAvailability')
        .mockRejectedValue(new NotFoundException());

      await expect(
        availabilityController.getAvailability('1', '2023-10-10'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if working hours are invalid', async () => {
      jest
        .spyOn(availabilityService, 'getAvailability')
        .mockRejectedValue(new Error('Horários de funcionamento inválidos'));

      await expect(
        availabilityController.getAvailability('1', '2023-10-10'),
      ).rejects.toThrow('Horários de funcionamento inválidos');
    });
  });
});
