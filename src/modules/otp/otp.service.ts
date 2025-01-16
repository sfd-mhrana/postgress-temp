import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Otp } from './otp.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SendOtpDto } from './dtos/send.dto';
import { IResponsePayload } from 'src/shared/interfaces/response-payload.interface';
import { UtilsService } from 'src/shared/modules/utils/utils.service';
import { VerityOtpDto } from './dtos/verify.dto';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
        private utilsService: UtilsService
    ) { }

    async send(data: SendOtpDto): Promise<IResponsePayload<string>> {
        try {
            const otp = await this.utilsService.generateUniqueOTP(6);
            await this.otpRepository.save({
                email: data.email,
                value: otp
            });

            //Send Email here

            return {
                success: true,
                message: `Registration Success`,
            } as IResponsePayload<string>;
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


    async verify(data: VerityOtpDto): Promise<IResponsePayload<string>> {
        try {

            const emailOtp = await this.otpRepository.findOne({
                where: { email: data.email },
            });

            if (!emailOtp)
                return {
                    success: false,
                    message: `Otp Verification failed`,
                };

            if (emailOtp.value != data.otp)
                return {
                    success: false,
                    message: `Otp Verification failed`,
                };

            //Delete Otp here

            return {
                success: true,
                message: `Otp Verification Success`,
            } as IResponsePayload<string>;
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
