import { Body, Controller, Post } from '@nestjs/common';
import { CareerAiService } from './career-ai.service';
import type { AnalyzeCareerInput } from './career-ai.types';

@Controller('career-ai')
export class CareerAiController {
  constructor(private readonly careerAiService: CareerAiService) {}

  @Post('analyze')
  analyzeCareer(@Body() body: AnalyzeCareerInput) {
    return this.careerAiService.analyzeCareer(body);
  }
}
