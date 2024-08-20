import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Req,
  UseGuards,
  Request, Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { BalanceUpdateDto } from './dto/balance-update.dto';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';


@Controller('/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() queryDto: UserQueryDto): Promise<GeneralResponseDto> {
    console.log(queryDto);
    return this.userService.getUsers(queryDto);
  }

  @Post()
  async store(@Body() createUserDto: CreateUserDto): Promise<GeneralResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  async getID(@Param('id') id: string): Promise<GeneralResponseDto> {
    return this.userService.getID(id);
  }

  //route PATCH /users/:id hanya untuk hardcode admin ke database
  // @Patch('/:id')
  // async update(
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Param('id') id: string,
  // ): Promise<GeneralResponseDto> {
  //   return this.userService.update(updateUserDto, id);
  // }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<GeneralResponseDto> {
    return this.userService.delete(id);
  }

  @Post('/:id/balance')
  async incrementBalance(
    @Param('id') id: string,
    @Body() balanceUpdateDto: BalanceUpdateDto,
  ): Promise<GeneralResponseDto> {
    return this.userService.updateBalance(id, balanceUpdateDto);
  }
}
