import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [PrismaClient, UsersModule, AuthModule, AppointmentsModule],
})
export class AppModule {}
