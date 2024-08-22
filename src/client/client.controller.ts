import { Body, Controller, Get, Post, Redirect, Render, UseGuards,Request, HttpStatus, Res, InternalServerErrorException, } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { GeneralResponseDto } from 'src/response/dto/general-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ClientLoginDto } from './dto/client-login.dto';
import axios, { type AxiosInstance } from 'axios';
@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('/')
  @Redirect('/home')
  redirectToHome() {
    return {};
  }
  @Get('/register')
  @Render('register.hbs')
  async showRegistrationForm() {
    return {};
  }

  @Post('/create-user')
  @Render('register.hbs')
  async submitRegister(@Body() createUserDto: CreateUserDto) {
    const response: GeneralResponseDto = await this.clientService.registerUser(createUserDto);
    return { message: response.message }; 
  }

  @Get('/home')
  @Render('home.hbs')
  async showHomePage(){
    return{}
  }

  @Get('/client-login')
  @Render('login.hbs')
  async showLoginPage(){
    return;
  }

  @Get('/browse-films')
  @Render('browse-films')
  async showFilmCatalog(){
    return;
  }


  @Post('/client-login')
  async clientLogin(@Body() clientLoginDto: ClientLoginDto) {
    try {
      const resp = await this.clientService.clientLogin(clientLoginDto);
      
      if (resp.status === 'success') {
        return { token: resp.data.token };
      } else {
        return { message: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  @Get('/self-profile')
  @Render('profile.hbs')
  async showProfilePage(@Request() req) {
    const user = localStorage.getItem("username");
    console.log(user);
    return { user };
  }
}
