import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { CareerAiModule } from './career-ai/career-ai.module';

@Module({
  imports: [DbModule, AuthModule, RealtimeModule, CareerAiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
