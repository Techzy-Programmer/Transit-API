import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto, SignupDto, LoginDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const _30days = 30 * 24 * 60 * 60 * 1000;
const blockDuration = 6 * 60 * 60 * 1000; // 6 hours

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async googleLogin(googleUser) {
    let user = await this.prisma.user.findUnique({ where: { googleId: googleUser.id } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          password: await bcrypt.hash(uuidv4(), 10),
          googleId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
        },
      });
    }

    const token = uuidv4();

    await this.prisma.session.create({
      data: {
        expiresAt: new Date(Date.now() + _30days),
        userId: user.id,
        token,
      },
    });

    return { user, token };
  }

  async sendOtp(sendOtpDto: SendOtpDto, ip: string) {
    const { mobile, email } = sendOtpDto;

    const otpRequest = await this.prisma.otpRequest.findFirst({
      where: {
        OR: [{ mobile }, { email }, { ip }],
      },
    });

    if (!otpRequest) {
      await this.prisma.otpRequest.create({
        data: {
          ip,
          email,
          mobile,
          retries: 1,
          blockedUntil: new Date(Date.now()), // No block initially
        },
      });
    }

    if (otpRequest.blockedUntil && otpRequest.blockedUntil > new Date()) {
      throw new BadRequestException('Too many requests. Please try again later.');
    }

    if (otpRequest.retries >= 5) {
      await this.prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: {
          blockedUntil: new Date(Date.now() + blockDuration),
          retries: 0,
        },
      });

      throw new BadRequestException('Too many requests. You have been blocked.');
    }

    await this.prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { retries: otpRequest.retries + 1 },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.otp.create({
      data: {
        otp,
        email,
        mobile,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes OTP expiry
      },
    });

    // ToDo: Implement OTP sending logic here using Fast2SMS
    // console.log(`OTP for ${mobile || email}: ${otp}`);
    return { message: 'OTP sent successfully' };
  }

  async signup(signupDto: SignupDto) {
    const { mobile, email, name, password, otp } = signupDto;

    const validOtp = await this.prisma.otp.findFirst({
      where: {
        OR: [{ mobile }, { email }],
        otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!validOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        mobile,
        email,
        name,
      },
    });

    const token = uuidv4();

    await this.prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + _30days),
      },
    });

    await this.prisma.otp.delete({ where: { id: validOtp.id } });
    return { user, token };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { mobile: identifier }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = uuidv4();

    await this.prisma.session.create({
      data: {
        expiresAt: new Date(Date.now() + _30days),
        userId: user.id,
        token,
      },
    });

    return { user, token };
  }

  async checkSession(token: string) {
    if (!token) {
      throw new UnauthorizedException('No session found');
    }

    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return session.user;
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('No session found');
    }

    await this.prisma.session.delete({ where: { token } });
  }
}
