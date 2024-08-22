import { Injectable } from '@nestjs/common';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ClientLoginDto } from './dto/client-login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<GeneralResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      return {
        status: 'error',
        message: 'User atau email sudah pernah terdaftar',
        data: null,
      };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      balance: 0,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      status: 'success',
      message: 'Pendaftaran berhasil',
      data: plainToClass(User, savedUser),
    };
  }

  async clientLogin(clientLoginDto:ClientLoginDto): Promise<GeneralResponseDto>{
    const user = await this.clientValidateUser(clientLoginDto.username, clientLoginDto.password, clientLoginDto.email);
    if (!user) {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }

    const payload = { username: user.data.username };
    let token
    try {
      token = await this.jwtService.signAsync(payload);
    } catch (error) {
      console.error('Error generating JWT:', error);
      throw new Error('Failed to generate token');
    }
    
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
  async clientValidateUser(username: string, password: string, email:string): Promise<GeneralResponseDto> {
    const user = await this.userService.findByUsername(username);

    if (user) {
      if(user.email !== email){
        return {
          status: 'error',
          message: 'Email incorrect!',
          data: null,
        };
      }
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
}
