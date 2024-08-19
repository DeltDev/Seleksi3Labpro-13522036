//DTO ini hanya dipakai untuk hardcode admin ke database melalui route PATCH
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';



export class UpdateUserDto {
  @IsString()
  username:string;
  @IsEmail()
  email:string;
  @IsString()
  password:string;
  @IsInt()
  balance:number;
  @IsOptional()
  role?:'admin'|'regular';
}