import { Module, OnApplicationShutdown, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './film/film.module';
import { dataSourceOptions } from '../db/data-source';
import { UserSeeder } from '../db/user-seeder';
import { UserService } from './user/user.service';
import { MulterModule } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { Film } from './entity/film.entity';
import { S3Module } from './s3/s3.module';


@Module({
  controllers:[AppController],
  imports:[
    UserModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User,Film]),
    AuthModule,
    FilmModule,
    MulterModule.register(),
    S3Module,
  ],
  providers:[UserSeeder,UserService]
})
export class AppModule implements OnModuleInit{
  private readonly logger = new Logger(AppModule.name);
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly userService: UserService
  ) {}

  async onModuleInit() {
    const userCount = await this.userService.countUsers();
    if (userCount === 0) {
      await this.userSeeder.seed();
    }
  }
}