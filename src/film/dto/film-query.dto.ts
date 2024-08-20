import { IsOptional, IsString } from 'class-validator';

export class FilmQueryDto {
  @IsOptional()
  @IsString()
  q?:string;
}