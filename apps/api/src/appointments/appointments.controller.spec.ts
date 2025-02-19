import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class DummyJwtAuthGuard {
  canActivate(context: any): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { userId: 'test-user-id' };
    return true;
  }
}

describe('AppointmentsController', () => {
  let app: INestApplication;
  const appointmentsService = {
    findByUserIdPaginated: jest.fn(),
    createAppointment: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: appointmentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(DummyJwtAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /appointments', () => {
    it('should return paginated appointments for the user', async () => {
      const fakeAppointments = [
        {
          id: 'appointment-1',
          userId: 'test-user-id',
          serviceId: 'service-1',
          appointmentTime: new Date('2025-02-20T11:00:00Z'),
          createdAt: new Date(),
          service: { name: 'Service A', price: 10 },
        },
      ];
      appointmentsService.findByUserIdPaginated.mockResolvedValue(
        fakeAppointments,
      );

      const response = await request(app.getHttpServer())
        .get('/appointments?page=1&limit=10')
        .expect(200);

      const expectedAppointments = fakeAppointments.map((app) => ({
        ...app,
        appointmentTime: app.appointmentTime.toISOString(),
        createdAt: app.createdAt.toISOString(),
      }));

      expect(response.body).toEqual(expectedAppointments);
      expect(appointmentsService.findByUserIdPaginated).toHaveBeenCalledWith(
        'test-user-id',
        1,
        10,
      );
    });
  });

  describe('POST /appointments', () => {
    it('should create an appointment and return it', async () => {
      const createAppointmentDto = {
        serviceId: 'service-1',
        appointmentTime: new Date('2025-02-20T12:00:00Z').toISOString(),
      };

      const createdAppointment = {
        id: 'appointment-2',
        userId: 'test-user-id',
        serviceId: 'service-1',
        appointmentTime: new Date('2025-02-20T12:00:00Z'),
        createdAt: new Date(),
      };

      appointmentsService.createAppointment.mockResolvedValue(
        createdAppointment,
      );

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(createAppointmentDto)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: 'appointment-2',
          userId: 'test-user-id',
          serviceId: 'service-1',
        }),
      );
      expect(appointmentsService.createAppointment).toHaveBeenCalledWith(
        'test-user-id',
        createAppointmentDto,
      );
    });

    it('should throw a BadRequestException for past appointment time', async () => {
      const pastTime = new Date(Date.now() - 3600 * 1000).toISOString(); // 1 hour ago
      const createAppointmentDto = {
        serviceId: 'service-1',
        appointmentTime: pastTime,
      };

      appointmentsService.createAppointment.mockRejectedValue(
        new BadRequestException('Cannot schedule an appointment in the past'),
      );

      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send(createAppointmentDto)
        .expect(400);

      expect(response.body.message).toEqual(
        'Cannot schedule an appointment in the past',
      );
      expect(appointmentsService.createAppointment).toHaveBeenCalledWith(
        'test-user-id',
        createAppointmentDto,
      );
    });
  });
});
