import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SendOtpDto } from './dtos/send.dto';
import { VerityOtpDto } from './dtos/verify.dto';
import { IResponsePayload } from 'src/shared/interfaces/response-payload.interface';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
    constructor(private otpService: OtpService) {}
    
      @Post('send')
      @UsePipes(ValidationPipe)
      async send(@Body() dto: SendOtpDto): Promise<IResponsePayload<string>> {
        return await this.otpService.send(dto);
      }
    
      @Post('verify')
      @UsePipes(ValidationPipe)
      async verify(@Body() dto: VerityOtpDto): Promise<IResponsePayload<string>> {
        return await this.otpService.verify(dto);
      }
    
}
