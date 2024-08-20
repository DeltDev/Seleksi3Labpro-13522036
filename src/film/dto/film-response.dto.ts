import { IsArray, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilmResponseDto {
  @IsString()
  id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  director: string;
  @IsNumber()
  release_year: number;

  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  genre: string[];
  @IsNumber()
  price: number;
  @IsNumber()
  duration: number;
  @IsString()
  video_url: string;
  @IsString()
  cover_image_url: string;
  @IsString()
  created_at: string;
  @IsString()
  updated_at: string;
}