import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { Service as ServiceModel, Prisma } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAllPaginated', () => {
    it('should return paginated services', async () => {
      const result: ServiceModel[] = [
        {
          id: '1',
          name: 'Service 1',
          startTime: new Date(),
          endTime: new Date(),
          duration: 60,
          price: new Prisma.Decimal(100),
        },
        {
          id: '2',
          name: 'Service 2',
          startTime: new Date(),
          endTime: new Date(),
          duration: 60,
          price: new Prisma.Decimal(200),
        },
      ];
      jest.spyOn(prismaService.service, 'findMany').mockResolvedValue(result);

      expect(await service.findAllPaginated(1, 10)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a service with UTC start and end times', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service 1',
        startTime: '2023-10-10T08:00:00Z',
        endTime: '2023-10-10T17:00:00Z',
        duration: 60,
        price: 100,
      };
      const result: ServiceModel = {
        id: '1',
        ...createServiceDto,
        price: new Prisma.Decimal(createServiceDto.price),
        startTime: dayjs(createServiceDto.startTime).utc().toDate(),
        endTime: dayjs(createServiceDto.endTime).utc().toDate(),
      };
      jest.spyOn(prismaService.service, 'create').mockResolvedValue(result);

      expect(await service.create(createServiceDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a service with provided data and convert times to UTC', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service',
        startTime: '2023-10-10T08:00:00Z',
        endTime: '2023-10-10T17:00:00Z',
        duration: 60,
        price: 150,
      };
      const result: ServiceModel = {
        id: '1',
        name: updateServiceDto.name!,
        duration: updateServiceDto.duration!,
        price: new Prisma.Decimal(updateServiceDto.price!),
        startTime: dayjs(updateServiceDto.startTime).utc().toDate(),
        endTime: dayjs(updateServiceDto.endTime).utc().toDate(),
      };
      jest.spyOn(prismaService.service, 'update').mockResolvedValue(result);

      expect(await service.update('1', updateServiceDto)).toEqual(result);
    });
  });
});
