import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('/verify-token')
  verifyToken() {
    return { status: 'Token is valid' };
  }
}