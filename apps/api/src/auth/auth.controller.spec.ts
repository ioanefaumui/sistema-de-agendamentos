import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const authenticateUserDto: AuthenticateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = { access_token: 'accessToken' };
      jest.spyOn(authService, 'authenticate').mockResolvedValue(result);

      expect(await authController.login(authenticateUserDto)).toEqual(result);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const authenticateUserDto: AuthenticateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      jest
        .spyOn(authService, 'authenticate')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(authenticateUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
