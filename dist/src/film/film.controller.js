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
exports.FilmController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const create_film_dto_1 = require("./dto/create-film.dto");
const film_service_1 = require("./film.service");
const film_query_dto_1 = require("./dto/film-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt.auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const update_film_dto_1 = require("./dto/update-film.dto");
const s3_service_1 = require("../s3/s3.service");
let FilmController = class FilmController {
    constructor(filmService, s3Service) {
        this.filmService = filmService;
        this.s3Service = s3Service;
    }
    async handleUpload(createFilmDto, files) {
        const video = files.video ? files.video[0] : null;
        const coverImage = files.cover_image ? files.cover_image[0] : null;
        if (!video) {
            throw new common_1.BadRequestException('Video is required');
        }
        const videoKey = `videos/${Date.now()}-${video.originalname}`;
        const videoUrl = await this.s3Service.uploadFile(video, videoKey);
        let coverImageUrl, coverImageKey;
        if (coverImage) {
            coverImageKey = `images/${Date.now()}-${coverImage.originalname}`;
            coverImageUrl = await this.s3Service.uploadFile(coverImage, coverImageKey);
        }
        else {
            coverImageUrl = null;
        }
        const film = await this.filmService.createFilm(createFilmDto, videoUrl, coverImageUrl);
        const filmResponse = {
            id: film.id,
            title: film.title,
            description: film.description,
            director: film.director,
            release_year: film.release_year,
            genre: film.genre,
            price: film.price,
            duration: film.duration,
            video_url: film.video_url,
            cover_image_url: film.cover_image_url,
            created_at: film.created_at.toISOString(),
            updated_at: film.updated_at.toISOString(),
        };
        return {
            status: 'success',
            message: 'Film created successfully',
            data: filmResponse
        };
    }
    async getFilms(queryDto) {
        return this.filmService.getFilms(queryDto);
    }
    async getFilmFromID(id) {
        return this.filmService.getFilmFromID(id);
    }
    async deleteFilm(id) {
        return this.filmService.delete(id);
    }
    async updateFilm(updateFilmDto, files, id) {
        const video = files.video ? files.video[0] : null;
        const coverImage = files.cover_image ? files.cover_image[0] : null;
        let videoUrl;
        let videoKey;
        let coverImageUrl;
        let coverImageKey;
        if (video) {
            videoKey = `videos/${Date.now()}-${video.originalname}`;
            videoUrl = await this.s3Service.uploadFile(video, videoKey);
        }
        else {
            videoUrl = null;
        }
        if (coverImage) {
            coverImageKey = `images/${Date.now()}-${coverImage.originalname}`;
            coverImageUrl = await this.s3Service.uploadFile(coverImage, coverImageKey);
        }
        else {
            coverImageUrl = null;
        }
        return this.filmService.updateFilm(id, updateFilmDto, videoUrl, coverImageUrl);
    }
};
exports.FilmController = FilmController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'video', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ], {
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'video') {
                if ((0, path_1.extname)(file.originalname).toLowerCase() !== '.mp4') {
                    return cb(new common_1.BadRequestException('Invalid video format, only .mp4 is allowed'), false);
                }
            }
            if (file.fieldname === 'cover_image') {
                const allowedImageExtensions = ['.png', '.jpeg', '.jpg'];
                if (!allowedImageExtensions.includes((0, path_1.extname)(file.originalname).toLowerCase())) {
                    return cb(new common_1.BadRequestException('Invalid image format, only .png, .jpeg, .jpg are allowed'), false);
                }
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_film_dto_1.CreateFilmDto, Object]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "handleUpload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [film_query_dto_1.FilmQueryDto]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "getFilms", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "getFilmFromID", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "deleteFilm", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'video', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ], {
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'video') {
                if ((0, path_1.extname)(file.originalname).toLowerCase() !== '.mp4') {
                    return cb(new common_1.BadRequestException('Invalid video format, only .mp4 is allowed'), false);
                }
            }
            if (file.fieldname === 'cover_image') {
                const allowedImageExtensions = ['.png', '.jpeg', '.jpg'];
                if (!allowedImageExtensions.includes((0, path_1.extname)(file.originalname).toLowerCase())) {
                    return cb(new common_1.BadRequestException('Invalid image format, only .png, .jpeg, .jpg are allowed'), false);
                }
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_film_dto_1.UpdateFilmDto, Object, String]),
    __metadata("design:returntype", Promise)
], FilmController.prototype, "updateFilm", null);
exports.FilmController = FilmController = __decorate([
    (0, common_1.Controller)('films'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [film_service_1.FilmService,
        s3_service_1.S3Service])
], FilmController);
//# sourceMappingURL=film.controller.js.map