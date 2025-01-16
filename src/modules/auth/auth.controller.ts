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
import { RegistrationDto } from './dtos/registration.dto';
import { ChangePasswordDto } from './dtos/chnage-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @UseInterceptors(SetToken)
  async login(@Body() dto: LoginDto): Promise<ILoginResponsePayload> {
    return await this.authService.login(dto);
  }

  @Post('registration')
  @UsePipes(ValidationPipe)
  async registration(@Body() dto: RegistrationDto): Promise<ILoginResponsePayload> {
    return await this.authService.registration(dto);
  }

  @Post('change-password')
  @UsePipes(ValidationPipe)
  async changePassword(@Body() dto: ChangePasswordDto): Promise<ILoginResponsePayload> {
    return await this.authService.changePassword(dto);
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
