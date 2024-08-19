import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { FilmModule } from './film/film.module';
import { dataSourceOptions } from '../db/data-source';
import { UserSeeder } from '../db/user-seeder';
import { UserService } from './user/user.service';



@Module({
  controllers:[AppController],
  imports:[
    UserModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    FilmModule,
  ],
  providers:[UserSeeder]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userSeeder: UserSeeder) {}

  async onModuleInit() {
    await this.userSeeder.seed();
  }
}