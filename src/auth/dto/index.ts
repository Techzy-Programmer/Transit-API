import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class SendOtpDto {
  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class SignupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string;

  @IsString()
  otp: string;
}

export class LoginDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
