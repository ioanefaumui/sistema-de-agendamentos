import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Prisma } from '@prisma/client';

describe('ServicesController', () => {
  let servicesController: ServicesController;
  let servicesService: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            findAllPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    servicesController = module.get<ServicesController>(ServicesController);
    servicesService = module.get<ServicesService>(ServicesService);
  });

  describe('findAllPaginated', () => {
    it('should return paginated services', async () => {
      const result = [
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
      jest.spyOn(servicesService, 'findAllPaginated').mockResolvedValue(result);

      expect(await servicesController.findAllPaginated(1, 10)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service 1',
        startTime: '2023-10-10T08:00:00Z',
        endTime: '2023-10-10T17:00:00Z',
        duration: 60,
        price: 100,
      };
      const result = {
        id: '1',
        ...createServiceDto,
        price: new Prisma.Decimal(createServiceDto.price),
        startTime: new Date(createServiceDto.startTime),
        endTime: new Date(createServiceDto.endTime),
      };
      jest.spyOn(servicesService, 'create').mockResolvedValue(result);

      expect(await servicesController.create(createServiceDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service',
        startTime: '2023-10-10T08:00:00Z',
        endTime: '2023-10-10T17:00:00Z',
        duration: 60,
        price: 150,
      };
      const result = {
        id: '1',
        name: updateServiceDto.name!,
        duration: updateServiceDto.duration!,
        price: new Prisma.Decimal(updateServiceDto.price!),
        startTime: new Date(updateServiceDto.startTime!),
        endTime: new Date(updateServiceDto.endTime!),
      };
      jest.spyOn(servicesService, 'update').mockResolvedValue(result);

      expect(await servicesController.update('1', updateServiceDto)).toEqual(
        result,
      );
    });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      const result = {
        id: '1',
        name: 'Service 1',
        duration: 60,
        price: new Prisma.Decimal(100),
        startTime: new Date(),
        endTime: new Date(),
      };
      jest.spyOn(servicesService, 'remove').mockResolvedValue(result);

      expect(await servicesController.remove('1')).toEqual(result);
    });
  });
});
