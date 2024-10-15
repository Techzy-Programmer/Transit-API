import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // Add AuthModule to imports
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
