import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { MentorsModule } from './mentors/mentors.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [DbModule, AuthModule, RealtimeModule, MentorsModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
