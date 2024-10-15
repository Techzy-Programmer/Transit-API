import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SetMobileDto, VerifyMobileDto, UpdateProfileDto } from './dto';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileService } from './profile.service';
import { getClientIp } from 'src/utils/helpers';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: number }; 
}

@ApiTags('profile')
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('set-mobile')
  @ApiOperation({ summary: 'Set mobile number for the user' })
  @ApiBody({ type: SetMobileDto, description: 'DTO for setting mobile number' })
  @ApiResponse({ status: 201, description: 'Mobile number set successfully' })
  @ApiResponse({ status: 400, description: 'Invalid mobile number' })
  async setMobile(@Body() setMobileDto: SetMobileDto, @Req() req: RequestWithUser) {
    return this.profileService.setMobile(setMobileDto, getClientIp(req));
  }

  @Post('set-mobile/verify')
  @ApiOperation({ summary: 'Verify user’s mobile number' })
  @ApiBody({ type: VerifyMobileDto, description: 'DTO for verifying mobile number' })
  @ApiResponse({ status: 200, description: 'Mobile number verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyMobile(@Body() verifyMobileDto: VerifyMobileDto, @Req() req: RequestWithUser) {
    return this.profileService.verifyMobile(verifyMobileDto, req.user.id);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto, description: 'DTO for updating profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid profile data' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: RequestWithUser) {
    return this.profileService.updateProfile(updateProfileDto, req.user.id);
  }
}
