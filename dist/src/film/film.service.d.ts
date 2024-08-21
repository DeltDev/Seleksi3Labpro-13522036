import { Film } from '../entity/film.entity';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmQueryDto } from './dto/film-query.dto';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { S3Service } from '../s3/s3.service';
export declare class FilmService {
    private readonly filmRepository;
    private s3Service;
    constructor(filmRepository: Repository<Film>, s3Service: S3Service);
    createFilm(createFilmDto: CreateFilmDto, videoUrl: string, coverImageUrl: string | null): Promise<Film>;
    getFilms(filmQueryDto: FilmQueryDto): Promise<GeneralResponseDto>;
    getFilmFromID(filmId: string): Promise<GeneralResponseDto>;
    updateFilm(filmId: string, updateFilmDto: UpdateFilmDto, videoUrl: string | null, coverImageUrl: string | null): Promise<GeneralResponseDto>;
    delete(filmId: string): Promise<GeneralResponseDto>;
}
