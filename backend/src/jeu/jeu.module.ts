import { Module } from '@nestjs/common';
import { JeuGateway } from './jeu.gateway';
import { JeuService } from './jeu.service';

@Module({
  providers: [JeuGateway, JeuService],
})
export class JeuModule {}
