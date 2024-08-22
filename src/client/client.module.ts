import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/auth/auth.constants';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      UserModule,
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '24h' },
      }),HttpModule,
    ],
    controllers: [ClientController],
    providers: [ClientService, AuthService, UserService,],
  })
  export class ClientModule {}
  
  