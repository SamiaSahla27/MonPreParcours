import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { JwtSocketAuthService } from './security/jwt-socket-auth.service';
import { ChatMessageStore } from './store/chat-message.store';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    RealtimeGateway,
    RealtimeService,
    JwtSocketAuthService,
    ChatMessageStore,
  ],
})
export class RealtimeModule {}
