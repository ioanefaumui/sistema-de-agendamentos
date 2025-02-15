import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaClient, UsersModule, AuthModule],
})
export class AppModule {}
