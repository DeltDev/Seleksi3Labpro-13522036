import { Controller, Get, Post, UseGuards, ValidationPipe, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req): Promise<GeneralResponseDto> {
    const loginDto: LoginDto = req.body;
    console.log(loginDto);
    return this.authService.login(loginDto);
  }

  @Post('/register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<GeneralResponseDto> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/self')
  async getSelf(@Request() req): Promise<GeneralResponseDto> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.getUserFromToken(token);
  }
}
