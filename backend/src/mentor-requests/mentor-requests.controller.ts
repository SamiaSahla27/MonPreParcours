import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MentorRequestsService } from './mentor-requests.service';

@Controller('mentor-requests')
export class MentorRequestsController {
  constructor(private readonly mentorRequests: MentorRequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: any,
    @Body() body: { mentorId: string; message?: string },
  ) {
    return await this.mentorRequests.createRequest(req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incoming')
  async incoming(@Req() req: any) {
    return await this.mentorRequests.listIncomingPending(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decision')
  async decision(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { decision: 'accepted' | 'refused' },
  ) {
    if (body?.decision !== 'accepted' && body?.decision !== 'refused') {
      throw new BadRequestException('INVALID_DECISION');
    }

    return await this.mentorRequests.decide(req.user.sub, id, body.decision);
  }
}
