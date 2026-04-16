import { Module } from '@nestjs/common';
import { MentorRequestsController } from './mentor-requests.controller';
import { MentorRequestsService } from './mentor-requests.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [MentorRequestsController],
  providers: [MentorRequestsService],
})
export class MentorRequestsModule {}
