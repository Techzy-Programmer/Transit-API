import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';

@Module({
  providers: [AuthService, GoogleOauthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}