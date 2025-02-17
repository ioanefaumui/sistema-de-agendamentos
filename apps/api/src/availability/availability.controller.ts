// src/availability/availability.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailability(serviceId, date);
  }
}
