import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrientationModule } from './orientation/orientation.module';

@Module({
  imports: [OrientationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
