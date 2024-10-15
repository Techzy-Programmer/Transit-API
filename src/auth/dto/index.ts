import { IsString, IsEmail, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ 
    example: '1234567890', 
    description: 'The mobile number to which OTP will be sent', 
    required: false 
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'The email address to which OTP will be sent', 
    required: false 
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class SignupDto {
  @ApiProperty({ 
    example: 'John Doe', 
    description: 'The name of the user' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: '1234567890', 
    description: 'The mobile number of the user', 
    required: false 
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'The email address of the user', 
    required: false 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    example: 'P@ssw0rd123', 
    description: 'The password of the user', 
    minLength: 8 
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'The OTP sent to the user for verification' 
  })
  @IsString()
  otp: string;
}

export class LoginDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'User identifier can be an email or mobile number' 
  })
  @IsString()
  identifier: string;

  @ApiProperty({ 
    example: 'P@ssw0rd123', 
    description: 'The password of the user' 
  })
  @IsString()
  password: string;
}
