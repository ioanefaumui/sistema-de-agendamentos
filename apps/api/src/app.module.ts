import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    PrismaClient,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    ServicesModule,
  ],
})
export class AppModule {}
