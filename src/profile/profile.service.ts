import { SetMobileDto, VerifyMobileDto, UpdateProfileDto } from './dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async setMobile(setMobileDto: SetMobileDto, ip: string) {
    const { mobile } = setMobileDto;
    const existingUser = await this.prisma.user.findUnique({ where: { mobile } });

    if (existingUser) {
      throw new BadRequestException('Mobile number is already in use');
    }

    await this.authService.sendOtp({ mobile }, ip);
    return { message: 'OTP sent successfully' };
  }

  async verifyMobile(verifyMobileDto: VerifyMobileDto, userId: number) {
    const { mobile, otp } = verifyMobileDto;

    const validOtp = await this.prisma.otp.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        mobile,
        otp,
      },
    });

    if (!validOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { mobile },
    });

    await this.prisma.otp.delete({ where: { id: validOtp.id } });
    return { message: 'Mobile number verified and updated successfully' };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, userId: number) {
    const { name, dob, gender } = updateProfileDto;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { name, dob, gender },
    });

    return updatedUser;
  }
}
