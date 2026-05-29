import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrientationService } from './orientation.service';
import {
  CompleteOrientationSessionInput,
  CreateOrientationSessionInput,
} from './orientation.types';

@Controller('orientation')
export class OrientationController {
  constructor(private readonly orientationService: OrientationService) {}

  @Get('questions/intro')
  getIntroQuestions() {
    return this.orientationService.getIntroQuestions();
  }

  @Post('sessions')
  createSession(@Body() payload: CreateOrientationSessionInput) {
    return this.orientationService.startSession(payload);
  }

  @Post('sessions/:sessionId/complete')
  completeSession(
    @Param('sessionId') sessionId: string,
    @Body() payload: CompleteOrientationSessionInput,
  ) {
    return this.orientationService.completeSession(sessionId, payload);
  }
}
