import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [PrismaClient, UsersModule],
})
export class AppModule {}
