import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './mentors.service';

@Module({
  imports: [DbModule],
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
