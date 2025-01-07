import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { PASSPORT_AUTH_TOKEN } from 'src/config/static-data.config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy,PASSPORT_AUTH_TOKEN) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let token = null;
          if (request && request.cookies) {
            token =request.cookies[configService.get<string>('authTokenCookieName')];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('authJwtSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    };
  }
}
