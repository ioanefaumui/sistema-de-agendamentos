import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.authService.authenticate(authenticateUserDto);
  }
}
