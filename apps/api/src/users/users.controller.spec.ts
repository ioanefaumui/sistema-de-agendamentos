import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.user,
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      expect(await usersController.create(createUserDto)).toEqual(result);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
