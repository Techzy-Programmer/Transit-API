import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { SendOtpDto, SignupDto, LoginDto } from './dto';
import { getClientIp } from 'src/utils/helpers';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google-oauth/authorize')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google-oauth/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { token } = await this.authService.googleLogin(req.user as any);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.redirect('/profile');
  }

  @Post('otp/send')
  async sendOtp(@Body() sendOtpDto: SendOtpDto, @Req() req: Request) {
    return this.authService.sendOtp(sendOtpDto, getClientIp(req));
  }

  @Post('otp/signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { user, token } = await this.authService.signup(signupDto);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.json(user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { user, token } = await this.authService.login(loginDto);
    res.cookie('session', token, { httpOnly: true, secure: true });
    res.json(user);
  }

  @Get('session')
  async checkSession(@Req() req: Request) {
    return this.authService.checkSession(req.cookies.session);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.cookies.session);
    res.clearCookie('session');
    res.sendStatus(200);
  }
}
