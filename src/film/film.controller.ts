import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Get,
  Query, Param, UseGuards, Delete, Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmService } from './film.service';
import { GeneralResponseDto } from '../response/dto/general-response.dto';
import { FilmResponseDto } from './dto/film-response.dto';
import { UserQueryDto } from '../user/dto/user-query.dto';
import { FilmQueryDto } from './dto/film-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateFilmDto } from './dto/update-film.dto';
import { S3Service } from '../s3/s3.service';


@Controller('films')
@UseGuards(JwtAuthGuard, AdminGuard)
export class FilmController {
  constructor(private readonly filmService: FilmService,
              private s3Service: S3Service,) {}

  //buat film baru melalui admin
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
  ], {
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'video') {
        if (extname(file.originalname).toLowerCase() !== '.mp4') {
          return cb(new BadRequestException('Invalid video format, only .mp4 is allowed'), false);
        }
      }

      if (file.fieldname === 'cover_image') {
        const allowedImageExtensions = ['.png', '.jpeg', '.jpg'];
        if (!allowedImageExtensions.includes(extname(file.originalname).toLowerCase())) {
          return cb(new BadRequestException('Invalid image format, only .png, .jpeg, .jpg are allowed'), false);
        }
      }

      cb(null, true);
    },
  }))
  async handleUpload(
    @Body() createFilmDto: CreateFilmDto,
    @UploadedFiles() files: { video?: Express.Multer.File[], cover_image?: Express.Multer.File[] }
  ): Promise<GeneralResponseDto> {
    const video = files.video ? files.video[0] : null;
    const coverImage = files.cover_image ? files.cover_image[0] : null;

    if (!video) {
      throw new BadRequestException('Video is required');
    }
    const videoKey = `videos/${Date.now()}-${video.originalname}`;
    const videoUrl = await this.s3Service.uploadFile(video, videoKey);
    let coverImageUrl, coverImageKey;
    if(coverImage){
      coverImageKey = `images/${Date.now()}-${coverImage.originalname}`;
      coverImageUrl = await this.s3Service.uploadFile(coverImage, coverImageKey);
    } else {
      coverImageUrl = null
    }

    const film = await this.filmService.createFilm(
      createFilmDto,
      videoUrl,
      coverImageUrl
    );
    const filmResponse : FilmResponseDto = {
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

  @Get()
  async getFilms(@Query() queryDto: FilmQueryDto): Promise<GeneralResponseDto>{
    // console.log(queryDto);
    return this.filmService.getFilms(queryDto);
  }

  @Get('/:id')
  async getFilmFromID(@Param('id') id: string): Promise<GeneralResponseDto> {
    // console.log(id);
    return this.filmService.getFilmFromID(id);
  }

  @Delete('/:id')
  async deleteFilm(@Param('id') id: string): Promise<GeneralResponseDto> {
    return this.filmService.delete(id);
  }

  @Put('/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
  ], {
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'video') {
        if (extname(file.originalname).toLowerCase() !== '.mp4') {
          return cb(new BadRequestException('Invalid video format, only .mp4 is allowed'), false);
        }
      }

      if (file.fieldname === 'cover_image') {
        const allowedImageExtensions = ['.png', '.jpeg', '.jpg'];
        if (!allowedImageExtensions.includes(extname(file.originalname).toLowerCase())) {
          return cb(new BadRequestException('Invalid image format, only .png, .jpeg, .jpg are allowed'), false);
        }
      }

      cb(null, true);
    },
  }))
  async updateFilm(
    @Body() updateFilmDto: UpdateFilmDto,
    @UploadedFiles() files: { video?: Express.Multer.File[], cover_image?: Express.Multer.File[] },
    @Param('id') id: string
  ): Promise<GeneralResponseDto> {
    const video = files.video ? files.video[0] : null;
    const coverImage = files.cover_image ? files.cover_image[0] : null;
    let videoUrl;
    let videoKey;
    let coverImageUrl;
    let coverImageKey;
    if(video){
      videoKey = `videos/${Date.now()}-${video.originalname}`;
      videoUrl = await this.s3Service.uploadFile(video, videoKey);
    } else {
      videoUrl = null
    }
    if(coverImage){
      coverImageKey = `images/${Date.now()}-${coverImage.originalname}`;
      coverImageUrl = await this.s3Service.uploadFile(coverImage, coverImageKey);
    } else {
      coverImageUrl = null;
    }

    return this.filmService.updateFilm(id, updateFilmDto, videoUrl, coverImageUrl);
  }
}
