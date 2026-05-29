import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { EngagedCompaniesController } from './engaged-companies.controller';
import { EngagedCompaniesService } from './engaged-companies.service';

@Module({
  imports: [DbModule],
  controllers: [EngagedCompaniesController],
  providers: [EngagedCompaniesService],
})
export class EngagedCompaniesModule {}
