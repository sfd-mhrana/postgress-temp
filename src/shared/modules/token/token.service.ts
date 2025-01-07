import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // TODO IF NEED
  }

  getAccessToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('authTokenExpiredTime'),
    });
  }

  getRefreshToken(payload: IJwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('authRefreshTokenExpiredTime'),
    });
  }

  decodeToken(token: string) {
    const user: { id: number; name: string } = this.jwtService.decode(
      token,
    ) as any;
    return user;
  }
}
