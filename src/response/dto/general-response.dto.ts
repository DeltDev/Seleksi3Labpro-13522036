import { IsString } from 'class-validator';

export class GeneralResponseDto {
  @IsString()
  status: string;
  @IsString()
  message: string;
  data:any;
}