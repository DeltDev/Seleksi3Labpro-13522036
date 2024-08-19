import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password harus punya panjang minimal 8 karakter' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password harus mengandung setidaknya satu huruf kapital' })
  @Matches(/(?=.*[a-z])/, { message: 'Password harus mengandung setidaknya satu huruf kecil' })
  @Matches(/(?=.*[0-9])/, { message: 'Password harus mengandung setidaknya satu angka' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password harus mengandung setidaknya salah satu dari karakter ini:!@#$%^&*(),.?":{}|<>' })
  password: string;
}