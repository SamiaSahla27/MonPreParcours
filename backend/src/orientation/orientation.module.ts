import { Module } from '@nestjs/common';
import { GroqOrientationService } from './groq-orientation.service';
import { OrientationController } from './orientation.controller';
import { OrientationService } from './orientation.service';

@Module({
  controllers: [OrientationController],
  providers: [OrientationService, GroqOrientationService],
})
export class OrientationModule {}
