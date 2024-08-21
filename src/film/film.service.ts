import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../entity/film.entity';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmBuilder } from './film-builder';
import { FilmQueryDto } from './dto/film-query.dto';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { plainToClass } from 'class-transformer';
import { FilmResponseDto } from './dto/film-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    private s3Service: S3Service,
  ) {}

  async createFilm(createFilmDto: CreateFilmDto, videoUrl: string, coverImageUrl: string | null): Promise<Film> {
    const film = new FilmBuilder()
      .setTitle(createFilmDto.title)
      .setDescription(createFilmDto.description || '')
      .setDirector(createFilmDto.director)
      .setReleaseYear(createFilmDto.release_year)
      .setGenre(createFilmDto.genre)
      .setPrice(createFilmDto.price)
      .setDuration(createFilmDto.duration)
      .setVideoUrl(videoUrl)
      .setCoverImageUrl(coverImageUrl)
      .setCreatedAt(new Date())
      .setUpdatedAt(new Date())
      .build();
    // console.log(film)
    return await this.filmRepository.save(film);
  }

  async getFilms(filmQueryDto: FilmQueryDto): Promise<GeneralResponseDto> {
    // console.log(filmQueryDto);
    const query = filmQueryDto.q?.toLowerCase();
    // console.log(query)
    let films;

    if (!query) {
      films = await this.filmRepository.find();
    } else {
      films = await this.filmRepository.createQueryBuilder('film')
        .where('LOWER(film.title) LIKE :keyword', { keyword: `%${query}%` })
        .orWhere('LOWER(film.director) LIKE :keyword', { keyword: `%${query}%` })
        .getMany();
    }
    // console.log(films.length);
    if (films.length<=0) {
      return {
        status: 'error',
        message: 'Film not found',
        data: null,
      };
    }

    const filmResponses = plainToClass(FilmResponseDto, films);

    return {
      status: 'success',
      message: `Film retrieval successful ${query}`,
      data: filmResponses,
    };
  }

  async getFilmFromID(filmId: string): Promise<GeneralResponseDto> {
    try {
      if (!filmId) {
        throw new Error('FilmID is not valid');
      }
      const film = await this.filmRepository.findOne({ where: { id: filmId } });
      // console.log(film)
      if (!film) {
        throw new Error(`Film not found!`);
      }
      return {
        status: 'success',
        message: 'Film retrieval successful',
        data: plainToClass(FilmResponseDto, film),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Film retrieval failed: ${error.message}`,
        data: null,
      };
    }
  }

  async updateFilm(
    filmId: string,
    updateFilmDto: UpdateFilmDto,
    videoUrl: string | null,
    coverImageUrl: string | null
  ): Promise<GeneralResponseDto> {
    const existingFilm = await this.filmRepository.findOne({ where: { id: filmId } });

    if (!existingFilm) {
      throw new Error('Film not found');
    }

    if (videoUrl && existingFilm.video_url) {
      const oldVideoKey = existingFilm.video_url.split('videos/').pop();
      if (oldVideoKey) {
        try {
          await this.s3Service.deleteFile(`videos/${oldVideoKey}`);
        } catch (error) {
          console.error(`Failed to delete video from S3: ${error.message}`);
        }
      }
    }

    if (coverImageUrl && existingFilm.cover_image_url) {
      const oldImageKey = existingFilm.cover_image_url.split('images/').pop();
      if (oldImageKey) {
        try {
          await this.s3Service.deleteFile(`images/${oldImageKey}`);
        } catch (error) {
          console.error(`Failed to delete cover image from S3: ${error.message}`);
        }
      }
    }

    const updatedFilm = new FilmBuilder()
      .setTitle(updateFilmDto.title)
      .setDescription(updateFilmDto.description || existingFilm.description)
      .setDirector(updateFilmDto.director)
      .setReleaseYear(updateFilmDto.release_year)
      .setGenre(updateFilmDto.genre)
      .setPrice(updateFilmDto.price)
      .setDuration(updateFilmDto.duration)
      .setVideoUrl(videoUrl || existingFilm.video_url)
      .setCoverImageUrl(coverImageUrl || existingFilm.cover_image_url)
      .setCreatedAt(existingFilm.created_at)
      .setUpdatedAt(new Date())
      .build();

    await this.filmRepository.update(filmId, updatedFilm);

    return {
      status: 'success',
      message: 'Film updated successfully',
      data: updatedFilm,
    };
  }

  async delete(filmId: string): Promise<GeneralResponseDto> {
    const film = await this.filmRepository.findOne({ where: { id: filmId } });

    if (!film) {
      throw new Error('Film not found');
    }

    const videoKey = film.video_url.split('videos/').pop();
    if (videoKey) {
      try {
        await this.s3Service.deleteFile(`videos/${videoKey}`);
      } catch (error) {
        console.error(`Failed to delete video from S3: ${error.message}`);
      }
    }

    if (film.cover_image_url) {
      const coverImageKey = film.cover_image_url.split('images/').pop();
      if (coverImageKey) {
        try {
          await this.s3Service.deleteFile(`images/${coverImageKey}`);
        } catch (error) {
          console.error(`Failed to delete cover image from S3: ${error.message}`);
        }
      }
    }

    await this.filmRepository.delete(filmId);

    return {
      status: 'success',
      message: 'Film deleted successfully',
      data: film,
    };
  }
}
