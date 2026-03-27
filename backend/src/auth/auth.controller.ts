import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { UserRole } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; role: UserRole }) {
    return await this.auth.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.auth.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return await this.auth.me(req.user.sub);
  }
}
