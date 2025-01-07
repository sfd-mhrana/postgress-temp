import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ILoginResponsePayload } from '../interfaces/response-payload.interface';

@Injectable()
export class SetToken implements NestInterceptor {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((value) => {
        if (value.success) {
          res.cookie(
            this.configService.get<string>('authTokenCookieName'),
            value.token,
            {
              httpOnly: true,
            },
          );
          return {
            success: true,
            message: value.message,
          } as ILoginResponsePayload;
        } else {
          return value;
        }
      }),
      catchError((err) => throwError(() => new BadGatewayException())),
    );
  }
}
