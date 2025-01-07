import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
//Configs
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './modules/auth/auth.module';
import { appDataSource } from './config/db.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(appDataSource.options),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
}
