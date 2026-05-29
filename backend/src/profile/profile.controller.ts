import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMentorProfileDto } from './profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mentor')
  async getMentor(@Req() req: any) {
    return await this.profile.getMyMentorProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('mentor')
  async updateMentor(@Req() req: any, @Body() body: UpdateMentorProfileDto) {
    return await this.profile.updateMyMentorProfile(req.user.sub, body);
  }
}
