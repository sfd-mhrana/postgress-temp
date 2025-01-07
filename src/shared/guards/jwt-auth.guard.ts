import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_AUTH_TOKEN } from 'src/config/static-data.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_AUTH_TOKEN) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Sorry! User Not Found');
    }
    return user;
  }
}
