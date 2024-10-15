import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['session'];

    if (!token) {
      throw new UnauthorizedException('No session found');
    }

    try {
      const user = await this.authService.checkSession(token);
      if (!user.mobile) {
        throw new UnauthorizedException('Mobile number not set');
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }
}