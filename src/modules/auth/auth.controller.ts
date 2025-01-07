import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ILoginResponsePayload } from 'src/shared/interfaces/response-payload.interface';
import { AuthService } from './auth.service';
import { SetToken } from 'src/shared/interceptors/set-token.interceptor';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { IJwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @UseInterceptors(SetToken)
  async loginUser(@Body() user: LoginDto): Promise<ILoginResponsePayload> {
    return await this.authService.login(user);
  }

  @Get('check-login')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async checkUserLogin(
    @User() user: IJwtPayload | null,
  ): Promise<IJwtPayload | null> {
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
