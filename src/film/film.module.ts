import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../entity/film.entity';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { S3Module } from '../s3/s3.module';

@Module({
  controllers:[FilmController],
  providers: [FilmService],
  imports:[TypeOrmModule.forFeature([Film]),S3Module],
  exports:[FilmService]
})
export class FilmModule {}
