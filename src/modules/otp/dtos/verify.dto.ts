import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class VerityOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    otp: number;
}
