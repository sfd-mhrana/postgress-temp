import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PASSPORT_AUTH_TOKEN } from 'src/config/static-data.config';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UtilsModule } from 'src/shared/modules/utils/utils.module';
import { TokenModule } from 'src/shared/modules/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: PASSPORT_AUTH_TOKEN,
      property: 'user',
      session: false,
    }),
    UtilsModule,
    TokenModule
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
})
export class AuthModule { }
