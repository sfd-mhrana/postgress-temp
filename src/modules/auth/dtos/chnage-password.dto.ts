import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail, IsNumber } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;
}
