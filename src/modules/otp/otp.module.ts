import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './otp.entity';
import { OtpController } from './otp.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([Otp]),
  ],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
