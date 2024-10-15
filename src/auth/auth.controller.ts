import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SendOtpDto, SignupDto, LoginDto } from './dto';
import { getClientIp } from 'src/utils/helpers';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google-oauth/authorize')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Authorize Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleAuth() {}

  @Get('google-oauth/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiResponse({ status: 200, description: 'Handles Google OAuth callback and sets session cookie' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { token } = await this.authService.googleLogin(req.user as any);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.redirect('/profile');
  }

  @Post('otp/send')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiBody({ type: SendOtpDto, description: 'DTO for sending OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto, @Req() req: Request) {
    return this.authService.sendOtp(sendOtpDto, getClientIp(req));
  }

  @Post('otp/signup')
  @ApiOperation({ summary: 'Signup with OTP' })
  @ApiBody({ type: SignupDto, description: 'DTO for signup with OTP' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { user, token } = await this.authService.signup(signupDto);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.json(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto, description: 'DTO for user login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { user, token } = await this.authService.login(loginDto);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.json(user);
  }

  @Get('session')
  @ApiOperation({ summary: 'Check session' })
  @ApiResponse({ status: 200, description: 'Returns session status' })
  async checkSession(@Req() req: Request) {
    return this.authService.checkSession(req.cookies.session);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.cookies.session);
    res.clearCookie('session');
    res.sendStatus(200);
  }
}
