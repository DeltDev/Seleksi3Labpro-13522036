import { IsString, IsNumber, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFilmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @Type(() => Number)
  @IsNumber()
  release_year: number;


  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  genre: string[];

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  duration: number;

  @IsOptional()
  video?: any|null;

  @IsOptional()
  cover_image?: any | null;

}
