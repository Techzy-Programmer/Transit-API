import { IsString, IsOptional, IsDateString, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SetMobileDto {
  @ApiProperty({ 
    example: '+911234567890', 
    description: 'The mobile number of the user in international format' 
  })
  @IsString()
  @IsPhoneNumber('IN')
  mobile: string;
}

export class VerifyMobileDto {
  @ApiProperty({ 
    example: '+911234567890', 
    description: 'The mobile number to verify in international format' 
  })
  @IsString()
  @IsPhoneNumber('IN')
  mobile: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'The OTP sent to the user for verification' 
  })
  @IsString()
  otp: string;
}

export class UpdateProfileDto {
  @ApiProperty({ 
    example: 'John Doe', 
    description: 'The name of the user', 
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: '1990-01-01', 
    description: 'The date of birth of the user in ISO format (YYYY-MM-DD)', 
    required: false 
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  dob?: Date;

  @ApiProperty({ 
    example: 'Male', 
    description: 'The gender of the user', 
    required: false 
  })
  @IsOptional()
  @IsString()
  gender?: string;
}
