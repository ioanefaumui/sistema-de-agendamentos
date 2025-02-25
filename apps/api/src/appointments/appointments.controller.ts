import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserAppointments(
    @Req() req: Request,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    const user = req.user as { userId: string };

    return this.appointmentsService.findByUserIdPaginated(
      user.userId,
      page,
      limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string };
    return this.appointmentsService.createAppointment(
      user.userId,
      createAppointmentDto,
    );
  }
}
