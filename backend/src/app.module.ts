import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrientationModule } from './orientation/orientation.module';
import { RealtimeModule } from './realtime/realtime.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { MentorsModule } from './mentors/mentors.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MentorRequestsModule } from './mentor-requests/mentor-requests.module';

@Module({
  imports: [
    OrientationModule,
    DbModule,
    AuthModule,
    RealtimeModule,
    MentorsModule,
    ProfileModule,
    NotificationsModule,
    MentorRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
