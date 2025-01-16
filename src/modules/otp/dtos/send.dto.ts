import { IsNotEmpty, IsEmail } from 'class-validator';

export class SendOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
