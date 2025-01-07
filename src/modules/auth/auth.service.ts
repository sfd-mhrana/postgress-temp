import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { ILoginResponsePayload } from 'src/shared/interfaces/response-payload.interface';
import { QueryFailedError, Repository } from 'typeorm';
import { IJwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { TokenService } from 'src/shared/modules/token/token.service';
import { UtilsService } from 'src/shared/modules/utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
     @InjectRepository(User) private readonly userRepository: Repository<User>,
    private tokenService: TokenService,
    private utilsService: UtilsService
  ) { }
  async login(userLogin: LoginDto): Promise<ILoginResponsePayload> {
    try {
      const userData = await this.userRepository.findOne({
        where:{
          email:userLogin.username
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
          message: `Something Wrong in DB`,
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
