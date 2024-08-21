import { Injectable, ConflictException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserQueryDto } from './dto/user-query.dto';
import { BalanceUpdateDto } from './dto/balance-update.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { GeneralResponseDto } from '../response/dto/general-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(userQueryDto: UserQueryDto): Promise<GeneralResponseDto> {
    try {
      let users;
      // console.log(userQueryDto);
      if (!userQueryDto.q) {
        users = await this.userRepository.find({ where: { role: 'regular' } });
      } else {
        users = await this.userRepository.find({
          where: {
            username: Like(`%${userQueryDto.q.toLowerCase()}%`),
            role: 'regular',
          },
        });
      }

      if (users.length <= 0) {
        throw new Error('User not found');
      }

      return {
        status: 'success',
        message: `User retrieval successful %${userQueryDto}%`,
        data: plainToClass(UserResponseDto, users),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `User retrieval failed: ${error.message}`,
        data: null,
      };
    }
  }

  async create(userDto: CreateUserDto): Promise<GeneralResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userDto.username.toLowerCase() }, { email: userDto.email.toLowerCase() }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 12);
    const newUser = this.userRepository.create({
      username: userDto.username,
      email: userDto.email,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      password: hashedPassword,
      role: 'regular',
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      status: 'success',
      message: 'User registration successful',
      data: plainToClass(UserResponseDto, savedUser),
    };
  }
  //fungsi update ini hanya untuk hardcode admin ke database
  // async update(userDto: UpdateUserDto, userId: string): Promise<GeneralResponseDto> {
  //   try {
  //     const hashedPassword = await bcrypt.hash(userDto.password, 12);
  //     await this.userRepository.update(userId, {
  //       username: userDto.username,
  //       email: userDto.email,
  //       password: hashedPassword,
  //       balance:userDto.balance,
  //       role: userDto.role,
  //     });
  //
  //     return {
  //       status: 'success',
  //       message: 'User update successful',
  //       data: null,
  //     };
  //   } catch (error) {
  //     return {
  //       status: 'error',
  //       message: `User update failed: ${error.message}`,
  //       data: null,
  //     };
  //   }
  // }


  async getID(userId: string): Promise<GeneralResponseDto> {
    try {
      if (!userId) {
        throw new Error('UserID is not valid');
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      return {
        status: 'success',
        message: 'User retrieval successful',
        data: plainToClass(UserResponseDto, user),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `User retrieval failed: ${error.message}`,
        data: null,
      };
    }
  }

  async delete(userId: string): Promise<GeneralResponseDto> {
    try {
      if (!userId) {
        throw new Error('id is not valid');
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if(user.role === 'admin'){
        throw new Error('you cannot delete this user (admin)');
      }
      const result = await this.userRepository.delete(userId);

      if (result.affected === 0) {
        throw new Error('User not found');
      }

      return {
        status: 'success',
        message: 'User deletion successful',
        data: plainToClass(UserResponseDto, user),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `User deletion failed: ${error.message}`,
        data: null,
      };
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateBalance(id: string, balanceUpdateDto: BalanceUpdateDto): Promise<GeneralResponseDto> {
    try {
      if (balanceUpdateDto.increment <= 0) {
        throw new Error('increment is a negative number');
      }
      if (typeof balanceUpdateDto.increment !== 'number') {
        throw new Error('increment is not a number');
      }
      let user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('User not found');
      }
      await this.userRepository.update(id, {
        balance: () => `balance + ${balanceUpdateDto.increment}`,
      });
      user = await this.userRepository.findOne({ where: { id } });
      return {
        status: 'success',
        message: 'Balance update successful',
        data: plainToClass(UserResponseDto, user),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Balance update failed: ${error.message}`,
        data: null,
      };
    }
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }
}
