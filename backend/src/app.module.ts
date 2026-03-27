import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DbModule, AuthModule, RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
