import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { ILoginResponsePayload } from 'src/shared/interfaces/response-payload.interface';
import { QueryFailedError, Repository } from 'typeorm';
import { IJwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { TokenService } from 'src/shared/modules/token/token.service';
import { UtilsService } from 'src/shared/modules/utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RegistrationDto } from './dtos/registration.dto';
import { ChangePasswordDto } from './dtos/chnage-password.dto';
import { Otp } from '../otp/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private tokenService: TokenService,
    private utilsService: UtilsService
  ) { }

  async login(userLogin: LoginDto): Promise<ILoginResponsePayload> {
    try {
      const userData = await this.userRepository.findOne({
        where: {
          email: userLogin.email
        }
      });

      if (!userData) {
        return {
          success: false,
          message: `User not found by this email`,
        } as ILoginResponsePayload;
      }

      const isMatch = await this.utilsService.isMatchHash(
        userLogin.password,
        userData.password,
      );

      if (!isMatch) {
        return {
          success: false,
          message: `Password Not Match`,
        } as ILoginResponsePayload;
      }

      const payload: IJwtPayload = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };

      const refreshToken = this.tokenService.getRefreshToken(payload);
      const refreshTokenUpdate = await this.userRepository.update(
        userData.id,
        { refreshToken: refreshToken },
      );

      if (refreshTokenUpdate) {
        return {
          success: true,
          message: `Access Granted`,
          token: this.tokenService.getAccessToken(payload),
        } as ILoginResponsePayload;
      } else {
        return {
          success: false,
          message: `Something Wrong, Try again.`,
        } as ILoginResponsePayload;
      }

    } catch (error: any) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError('Duplicate Phone/Email Error', [], null);
        }
        throw new QueryFailedError(error.message, [], null);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async registration(data: RegistrationDto): Promise<ILoginResponsePayload> {
    try {
      const hashPassword = await this.utilsService.getHash(data.password);
      await this.userRepository.save({
        email: data.email,
        password: hashPassword
      });
      return {
        success: true,
        message: `Registration Success`,
      } as ILoginResponsePayload;
    } catch (error: any) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError('Duplicate Phone/Email Error', [], null);
        }
        throw new QueryFailedError(error.message, [], null);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async changePassword(data: ChangePasswordDto): Promise<ILoginResponsePayload> {
    try {

      const emailOtp = await this.otpRepository.findOne({
        where: { email: data.email },
      });
      if (!emailOtp)
        return {
          success: false,
          message: `Wrong otp submit`,
        };
        
      const userData = await this.userRepository.findOne({
        where: {
          email: data.email
        }
      });

      if (!userData) {
        return {
          success: false,
          message: `User not found by this email`,
        } as ILoginResponsePayload;
      }

      const hashPassword = await this.utilsService.getHash(data.password);

      const passwordUpdate = await this.userRepository.update(
        userData.id,
        { password: hashPassword },
      );

      if (passwordUpdate) {
        return {
          success: true,
          message: `Password updated`,
        } as ILoginResponsePayload;
      } else {
        return {
          success: false,
          message: `Something Wrong, Try again.`,
        } as ILoginResponsePayload;
      }

    } catch (error: any) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError('Duplicate Phone/Email Error', [], null);
        }
        throw new QueryFailedError(error.message, [], null);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

}
