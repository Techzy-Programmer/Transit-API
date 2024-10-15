import { SetMobileDto, VerifyMobileDto, UpdateProfileDto } from './dto';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileService } from './profile.service';
import { getClientIp } from 'src/utils/helpers';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: number }; 
}

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('set-mobile')
  async setMobile(@Body() setMobileDto: SetMobileDto, @Req() req: RequestWithUser) {
    return this.profileService.setMobile(setMobileDto, getClientIp(req));
  }

  @Post('set-mobile/verify')
  async verifyMobile(@Body() verifyMobileDto: VerifyMobileDto, @Req() req: RequestWithUser) {
    return this.profileService.verifyMobile(verifyMobileDto, req.user.id);
  }

  @Post('update')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: RequestWithUser) {
    return this.profileService.updateProfile(updateProfileDto, req.user.id);
  }
}
