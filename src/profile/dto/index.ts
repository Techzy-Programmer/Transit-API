import { IsString, IsOptional, IsDateString, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SetMobileDto {
  @IsString()
  @IsPhoneNumber('IN')
  mobile: string;
}

export class VerifyMobileDto {
  @IsString()
  @IsPhoneNumber('IN')
  mobile: string;

  @IsString()
  otp: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  dob?: Date;

  @IsOptional()
  @IsString()
  gender?: string;
}
