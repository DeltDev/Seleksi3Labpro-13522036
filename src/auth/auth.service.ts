import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserService } from '../user/user.service';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<GeneralResponseDto> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      const isPasswordMatching = await this.userService.comparePasswords(
        password,
        user.password,
      );
      if (isPasswordMatching) {
        return {
          status: 'success',
          message: 'Login successful',
          data: plainToClass(UserResponseDto, user),
        };
      }
      return {
        status: 'error',
        message: 'Password incorrect!',
        data: null,
      };
    }
    return {
      status: 'error',
      message: 'User not found!',
      data: null,
    };
  }

  async login(loginDto: LoginDto): Promise<GeneralResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }

    const payload = { username: user.data.username };
    const token = this.jwtService.sign(payload);
    console.log(token)
    const loginResponseDto: LoginResponseDto = {
      username: user.data.username,
      token: token,
    };

    return {
      status: 'success',
      message: 'Login successful',
      data: loginResponseDto,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<GeneralResponseDto> {
    try {
      const response = await this.userService.create(createUserDto);
      return {
        status: 'success',
        message: 'Registration successful',
        data: response.data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Registration failed: ${error.message}`,
        data: null,
      };
    }
  }

  async getUserFromToken(token: string): Promise<GeneralResponseDto> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findByUsername(decoded.username);

      if (!user) {
        return {
          status: 'error',
          message: 'User not found!',
          data: null,
        };
      }

      const loginResponseDto: LoginResponseDto = {
        username: user.username,
        token: token,
      };

      return {
        status: 'success',
        message: 'User authenticated',
        data: loginResponseDto,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Authentication failed: ${error.message}`,
        data: null,
      };
    }
  }
}