import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}
