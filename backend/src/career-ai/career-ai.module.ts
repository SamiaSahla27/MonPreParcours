import { Module } from '@nestjs/common';
import { CareerAiController } from './career-ai.controller';
import { CareerAiService } from './career-ai.service';

@Module({
  controllers: [CareerAiController],
  providers: [CareerAiService],
})
export class CareerAiModule {}
