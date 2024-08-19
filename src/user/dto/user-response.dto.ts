import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  username: string;
  @Exclude()
  firstName?: string;
  @Exclude()
  lastName?: string;
  @IsEmail()
  email: string;
  @Exclude()
  role?:string;
  @Exclude()
  password?: string;
}