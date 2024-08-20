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

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
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

    return await this.filmRepository.save(film);
  }

  async getFilms(filmQueryDto: FilmQueryDto): Promise<GeneralResponseDto> {
    console.log(filmQueryDto);
    const query = filmQueryDto.q?.toLowerCase();
    console.log(query)
    let films;

    if (!query) {
      films = await this.filmRepository.find();
    } else {
      films = await this.filmRepository.createQueryBuilder('film')
        .where('LOWER(film.title) LIKE :keyword', { keyword: `%${query}%` })
        .orWhere('LOWER(film.director) LIKE :keyword', { keyword: `%${query}%` })
        .getMany();
    }
    console.log(films.length);
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
      console.log(film)
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

  async delete(filmId: string): Promise<GeneralResponseDto> {
    try {
      if (!filmId) {
        throw new Error('FilmID is not valid');
      }
      const film = await this.filmRepository.findOne({ where: { id: filmId } });
      const result = await this.filmRepository.delete(filmId);

      if (result.affected === 0) {
        throw new Error('Film not found');
      }

      return {
        status: 'success',
        message: 'Film deletion successful',
        data: plainToClass(FilmResponseDto, film),
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Film deletion failed: ${error.message}`,
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
    try {
      const existingFilm = await this.filmRepository.findOne({ where: { id: filmId } });

      if (!existingFilm) {
        throw new Error('Film not found');
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

      const filmResponse: FilmResponseDto = {
        id: updatedFilm.id,
        title: updatedFilm.title,
        description: updatedFilm.description,
        director: updatedFilm.director,
        release_year: updatedFilm.release_year,
        genre: updatedFilm.genre,
        price: updatedFilm.price,
        duration: updatedFilm.duration,
        video_url: updatedFilm.video_url,
        cover_image_url: updatedFilm.cover_image_url,
        created_at: updatedFilm.created_at.toISOString(),
        updated_at: updatedFilm.updated_at.toISOString(),
      };

      return {
        status: 'success',
        message: 'Film updated successfully',
        data: filmResponse,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Film update failed: ${error.message}`,
        data: null,
      };
    }
  }
}
