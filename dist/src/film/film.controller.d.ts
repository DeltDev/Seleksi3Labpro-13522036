import { CreateFilmDto } from './dto/create-film.dto';
import { FilmService } from './film.service';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { FilmQueryDto } from './dto/film-query.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { S3Service } from '../s3/s3.service';
export declare class FilmController {
    private readonly filmService;
    private s3Service;
    constructor(filmService: FilmService, s3Service: S3Service);
    handleUpload(createFilmDto: CreateFilmDto, files: {
        video?: Express.Multer.File[];
        cover_image?: Express.Multer.File[];
    }): Promise<GeneralResponseDto>;
    getFilms(queryDto: FilmQueryDto): Promise<GeneralResponseDto>;
    getFilmFromID(id: string): Promise<GeneralResponseDto>;
    deleteFilm(id: string): Promise<GeneralResponseDto>;
    updateFilm(updateFilmDto: UpdateFilmDto, files: {
        video?: Express.Multer.File[];
        cover_image?: Express.Multer.File[];
    }, id: string): Promise<GeneralResponseDto>;
}
