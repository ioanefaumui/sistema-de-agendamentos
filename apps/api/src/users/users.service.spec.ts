import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a user with hashed password if email does not exist', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = {
        id: '1',
        email: createUserDto.email,
        password: hashedPassword,
        role: Role.user,
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      expect(await usersService.create(createUserDto)).toEqual(user);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser = {
        id: '1',
        email: createUserDto.email,
        password: 'hashedPassword',
        role: Role.user,
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(existingUser);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user if email exists', async () => {
      const email = 'test@example.com';
      const user = {
        id: '1',
        email,
        password: 'hashedPassword',
        role: Role.user,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      expect(await usersService.findByEmail(email)).toEqual(user);
    });

    it('should return null if email does not exist', async () => {
      const email = 'test@example.com';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      expect(await usersService.findByEmail(email)).toBeNull();
    });
  });
});
