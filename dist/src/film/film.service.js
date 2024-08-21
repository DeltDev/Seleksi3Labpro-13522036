"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilmService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const film_entity_1 = require("../entity/film.entity");
const typeorm_2 = require("typeorm");
const film_builder_1 = require("./film-builder");
const class_transformer_1 = require("class-transformer");
const film_response_dto_1 = require("./dto/film-response.dto");
const s3_service_1 = require("../s3/s3.service");
let FilmService = class FilmService {
    constructor(filmRepository, s3Service) {
        this.filmRepository = filmRepository;
        this.s3Service = s3Service;
    }
    async createFilm(createFilmDto, videoUrl, coverImageUrl) {
        const film = new film_builder_1.FilmBuilder()
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
    async getFilms(filmQueryDto) {
        const query = filmQueryDto.q?.toLowerCase();
        let films;
        if (!query) {
            films = await this.filmRepository.find();
        }
        else {
            films = await this.filmRepository.createQueryBuilder('film')
                .where('LOWER(film.title) LIKE :keyword', { keyword: `%${query}%` })
                .orWhere('LOWER(film.director) LIKE :keyword', { keyword: `%${query}%` })
                .getMany();
        }
        if (films.length <= 0) {
            return {
                status: 'error',
                message: 'Film not found',
                data: null,
            };
        }
        const filmResponses = (0, class_transformer_1.plainToClass)(film_response_dto_1.FilmResponseDto, films);
        return {
            status: 'success',
            message: `Film retrieval successful ${query}`,
            data: filmResponses,
        };
    }
    async getFilmFromID(filmId) {
        try {
            if (!filmId) {
                throw new Error('FilmID is not valid');
            }
            const film = await this.filmRepository.findOne({ where: { id: filmId } });
            if (!film) {
                throw new Error(`Film not found!`);
            }
            return {
                status: 'success',
                message: 'Film retrieval successful',
                data: (0, class_transformer_1.plainToClass)(film_response_dto_1.FilmResponseDto, film),
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Film retrieval failed: ${error.message}`,
                data: null,
            };
        }
    }
    async updateFilm(filmId, updateFilmDto, videoUrl, coverImageUrl) {
        const existingFilm = await this.filmRepository.findOne({ where: { id: filmId } });
        if (!existingFilm) {
            throw new Error('Film not found');
        }
        if (videoUrl && existingFilm.video_url) {
            const oldVideoKey = existingFilm.video_url.split('videos/').pop();
            if (oldVideoKey) {
                try {
                    await this.s3Service.deleteFile(`videos/${oldVideoKey}`);
                }
                catch (error) {
                    console.error(`Failed to delete video from S3: ${error.message}`);
                }
            }
        }
        if (coverImageUrl && existingFilm.cover_image_url) {
            const oldImageKey = existingFilm.cover_image_url.split('images/').pop();
            if (oldImageKey) {
                try {
                    await this.s3Service.deleteFile(`images/${oldImageKey}`);
                }
                catch (error) {
                    console.error(`Failed to delete cover image from S3: ${error.message}`);
                }
            }
        }
        const updatedFilm = new film_builder_1.FilmBuilder()
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
    async delete(filmId) {
        const film = await this.filmRepository.findOne({ where: { id: filmId } });
        if (!film) {
            throw new Error('Film not found');
        }
        const videoKey = film.video_url.split('videos/').pop();
        if (videoKey) {
            try {
                await this.s3Service.deleteFile(`videos/${videoKey}`);
            }
            catch (error) {
                console.error(`Failed to delete video from S3: ${error.message}`);
            }
        }
        if (film.cover_image_url) {
            const coverImageKey = film.cover_image_url.split('images/').pop();
            if (coverImageKey) {
                try {
                    await this.s3Service.deleteFile(`images/${coverImageKey}`);
                }
                catch (error) {
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
};
exports.FilmService = FilmService;
exports.FilmService = FilmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(film_entity_1.Film)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        s3_service_1.S3Service])
], FilmService);
//# sourceMappingURL=film.service.js.map