import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../entity/film.entity';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';

@Module({
  controllers:[FilmController],
  providers: [FilmService],
  imports:[TypeOrmModule.forFeature([Film])],
  exports:[FilmService]
})
export class FilmModule {}
